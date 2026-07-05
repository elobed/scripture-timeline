import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild,
  AfterViewInit, inject, signal, computed, ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FilterService } from '../../services/filter.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { TimelineEvent } from '../../models/timeline.models';
import { TIMELINE_EVENTS, TIMELINE_TAGS, TIMELINE_ERAS } from '../../data/timeline-events.data';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, EventCardComponent, EventModalComponent],
  template: `
    <!-- TODO: era grouping — data is ready, UI implementation pending -->
    <div class="timeline-wrapper">
      <!-- Desktop: horizontal timeline -->
      <div
        class="timeline-track"
        #trackRef
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseUp()"
        (wheel)="onWheel($event)"
        [class.is-dragging]="isDragging()">

        <!-- Event items. We pass current-tracks into CSS to dynamically scale horizontal density. -->
        <div class="timeline-events-row" [style.--current-tracks]="tracksCount()">
          <!-- The central line moved here to inherit full layout width -->
          <div class="timeline-line"></div>
          
          <!-- Eras Overlay -->
          <div class="eras-container">
            <div *ngFor="let era of layoutEras(); let fi = first; let li = last" 
                 class="era-bracket"
                 [class.era-first]="fi"
                 [class.era-last]="li"
                 [style.--era-color]="era.color"
                 [style.--era-bg-img]="era.bgImage"
                 [style.--start-index]="era.startIndex"
                 [style.--span-slots]="era.spanSlots">
              <div class="era-label">{{ era.title }}</div>
            </div>
          </div>

          <div
            *ngFor="let item of layoutItems(); let i = index"
            class="timeline-event-slot"
            [class.slot-above]="item.position === 'above'"
            [class.slot-below]="item.position === 'below'"
            [attr.data-event-id]="item.event.id">

            <!-- Range bracket (for events with yearEnd) -->
            <div
              *ngIf="item.event.yearEnd !== null && item.visible"
              class="range-bracket"
              [style.--range-color]="getRangeColor(item.event)"
              [style.--span-slots]="item.spanSlots"
              [title]="'Duración: ' + item.event.yearStart + ' - ' + item.event.yearEnd">
                <div class="range-bracket-line"></div>
            </div>

            <!-- Event card -->
            <app-event-card
              *ngIf="item.visible"
              [event]="item.event"
              [position]="item.position"
              [isHighlighted]="filterSvc.isEventHighlighted(item.event)"
              [isDimmed]="filterSvc.hasHighlights() && !filterSvc.isEventHighlighted(item.event)"
              (cardClicked)="openModal($event)"
              class="event-card-host"
              [class.card-animate-in]="item.animated"
              [style.--track-index]="item.trackIndex">
            </app-event-card>

            <!-- Year label on line -->
            <div class="year-pin" [class.pin-above]="item.position === 'above'" [class.pin-below]="item.position === 'below'">
              <div *ngIf="item.event.yearEnd === null" class="year-pin-dot"
                [style.background]="'var(--color-timeline-dot)'"
                [style.border-color]="'var(--color-timeline-dot-border)'">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: vertical layout placeholder handled by CSS -->
    </div>

    <!-- Event modal -->
    <app-event-modal
      *ngIf="activeEvent()"
      [event]="activeEvent()!"
      [hasPrev]="hasPrevUrl()"
      [hasNext]="hasNextUrl()"
      (prev)="goPrevEvent()"
      (next)="goNextEvent()"
      (closed)="closeModal()">
    </app-event-modal>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    /* ── Timeline Wrapper ──────────────────────────────────────── */
    .timeline-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* ── Desktop: Horizontal Track ─────────────────────────────── */
    .timeline-track {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-x: auto;
      overflow-y: visible; /* Allow expanded cards below to float above filter panel */
      position: relative;
      cursor: grab;
      user-select: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: auto;
    }

    .timeline-track.is-dragging {
      cursor: grabbing;
    }

    /* Hide horizontal scrollbar visually but keep functional */
    .timeline-track::-webkit-scrollbar { height: 6px; }
    .timeline-track::-webkit-scrollbar-track { background: var(--color-surface-1); }
    .timeline-track::-webkit-scrollbar-thumb {
      background: var(--color-surface-2);
      border-radius: 3px;
    }

    /* ── The central horizontal line ──────────────────────────── */
    .timeline-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: var(--line-thickness);
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--color-timeline-line) 2%,
        var(--color-timeline-line) 98%,
        transparent 100%
      );
      transform: translateY(-50%);
      pointer-events: none;
      min-width: 100%;
      z-index: 2; /* Must be above .eras-container (z-index:0) and era overlays (z-index:1) */
    }

    /* ── Events Row ────────────────────────────────────────────── */
    .timeline-events-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      padding: 0 45vw; /* Massive left and right padding buffers specifically so large cards NEVER bleed off the scrolling canvas! */
      min-width: max-content;
      gap: 0;
      position: relative;
      
      /* Centralized mathematical width abstraction so Eras can share it */
      --dyn-div: calc(1 + min(calc(var(--current-tracks, 1) - 1), 1) * 1.2);
      --slot-w: calc((var(--card-width) + var(--card-gap)) / var(--dyn-div));
    }

    /* ── Eras Overlay ──────────────────────────────────────────── */
    .eras-container {
      position: absolute;
      top: 0; 
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* Don't block clicking */
      z-index: 0; /* Sit exactly behind the timeline line and cards */
    }

    .era-bracket {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(45vw + (var(--start-index) * var(--slot-w)) - (var(--slot-w) / 2));
      width: calc(var(--span-slots) * var(--slot-w));
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* label will be top-left */
      justify-content: flex-start;
      /* GUARANTEED to paint over the image by stacking as the first background layer */
      background-image:
        linear-gradient(
          90deg,
          var(--color-era-overlay-edge) 0%,
          var(--color-era-overlay)      15%,
          var(--color-era-overlay)      85%,
          var(--color-era-overlay-edge) 100%
        ),
        var(--era-bg-img);
      background-size: cover, cover;
      background-position: center, center;
      background-attachment: fixed, fixed;
      border-left: 2px dashed var(--era-color);
      border-right: 2px dashed var(--era-color);
      overflow: hidden;
    }

    /* First era extends infinitely left into the 45vw padding buffer 
       We set left to 0, but we must add its original left-offset to its width 
       so it stretches instead of just moving. */
    .era-bracket.era-first {
      left: 0;
      /* Original Width + Original Left Offset (where start-index is 0) */
      width: calc((var(--span-slots) * var(--slot-w)) + 45vw - (var(--slot-w) / 2));
      border-left: none;
    }

    /* Last era extends infinitely right into the 45vw padding buffer 
       Added 50vw instead of 45vw to account for the -0.5 slot_w offset on the left margin. */
    .era-bracket.era-last {
      width: calc((var(--span-slots) * var(--slot-w)) + 50vw);
      border-right: none;
    }

    .era-label {
      /* Sticky so it stays visible while scrolling through a long era */
      position: sticky;
      left: 12px;
      /* Anchor to top of era zone */
      align-self: flex-start;
      margin-top: 14px;
      padding: 4px 12px;
      font-family: var(--font-display);
      font-size: clamp(0.85rem, 1.4vw, 1.1rem);
      font-weight: 800; /* slightly heavier to pop through background */
      text-transform: uppercase;
      letter-spacing: 2px;
      /* Both themes now darken the background images, so label text is always light */
      color: rgba(255, 255, 255, 0.92);
      opacity: 0.95; 
      white-space: normal; /* keep wrapping */
      max-width: calc(100% - 24px); 
      pointer-events: none;
      z-index: 2;
      /* Keep the original era-color strictly for the pill so it's still color-coded */
      background: color-mix(in srgb, var(--era-color) 20%, transparent);
      border: 1.5px solid color-mix(in srgb, var(--era-color) 60%, transparent);
      border-radius: 4px;
    }

    /* ── Individual Event Slot ─────────────────────────────────── */
    .timeline-event-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex-shrink: 0;
      width: var(--slot-w);
      height: 100%;
    }

    /* Cards are placed absolutely from the 50% line */
    .slot-above .event-card-host {
      position: absolute;
      bottom: calc(50% + 18px + (var(--track-index, 0) * 64px));
    }

    .slot-below .event-card-host {
      position: absolute;
      top: calc(50% + 18px + (var(--track-index, 0) * 64px));
      /* Ensure expanded cards float above the filter panel (z-index: 90) */
      z-index: 100;
    }

    .timeline-event-slot.is-hidden .event-card-host {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    /* ── Range Bar: thick colored band with visible end-caps ─── */
    .range-bracket {
      position: absolute;
      top: calc(50% - 7px);
      left: 50%;
      width: max(24px, calc((var(--span-slots, 1) - 1) * var(--slot-w)));
      height: 14px;
      z-index: 110; /* Above timeline line, stems and slot-below cards */
      pointer-events: none;
      border-left: 4px solid var(--range-color);
      border-right: 4px solid var(--range-color);
      opacity: 1;
      /* Help it contrast against ANY background by dropping a card-colored shadow */
      filter: drop-shadow(0 0 3px var(--color-bg-card));
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .range-bracket-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 6px;
      background: var(--range-color);
      transform: translateY(-50%);
      opacity: 0.95;
      border-radius: 2px;
      transition: height 0.2s, opacity 0.2s;
    }

    /* Brackets top/bottom ticks */
    .range-bracket::before,
    .range-bracket::after {
      content: '';
      position: absolute;
      top: 0;
      width: 4px;
      height: 100%;
      border-top: 2px solid var(--range-color);
      border-bottom: 2px solid var(--range-color);
    }
    .range-bracket::before { left: -2px; }
    .range-bracket::after { right: -2px; }

    /* ── Year Pin Dot on Line ──────────────────────────────────── */
    .year-pin {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      /* Z-index 110 guarantees the dot renders ABOVE the card connector stem (which hits z-index 100 for below cards) */
      z-index: 110; 
    }

    .year-pin-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid var(--color-timeline-dot-border);
      background: var(--color-timeline-dot);
      box-shadow: 0 0 0 2px var(--color-timeline-dot);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
    }

    .year-pin-dot.is-range {
      border-radius: 3px;
      width: 16px;
      height: 16px;
    }

    /* ── Hover States for timeline line elements ── */
    
    /* 1. Scale DOT when hovering its slot */
    .timeline-event-slot:hover .year-pin-dot {
      transform: scale(1.4);
      box-shadow: 0 0 0 3px var(--color-timeline-dot), 0 0 8px rgba(0,0,0,0.3);
    }

    /* 2. Scale and brighten RANGE BRACKET when hovering its slot */
    .timeline-event-slot:hover .range-bracket {
      transform: scaleY(1.4);
      filter: drop-shadow(0 0 5px var(--range-color)) brightness(1.1);
      z-index: 115;
    }
    .timeline-event-slot:hover .range-bracket-line {
      height: 8px;
      opacity: 1;
    }

    /* Card animation state and explicit width unbounding */
    .event-card-host {
      --animation-offset: 20px;
      width: max-content; /* Critical: Unbounds the card from its 250px slot entirely */
      display: block;
      z-index: 2;
      transition: z-index 0.3s;
    }

    .event-card-host:hover,
    .event-card-host:focus-within {
      z-index: 20;
    }
    
    .slot-above .event-card-host {
      transform-origin: bottom center;
    }
    .slot-below .event-card-host {
      transform-origin: top center;
      --animation-offset: -20px;
    }

    .card-animate-in {
      animation: slideInFromLine 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes slideInFromLine {
      from {
        opacity: 0;
        transform: translateY(var(--animation-offset)) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* ── Mobile: Vertical Layout ───────────────────────────────── */
    @media (max-width: 768px) {
      :host {
        overflow-y: auto;
        overflow-x: hidden;
      }

      .timeline-wrapper {
        overflow-y: auto;
        overflow-x: hidden;
        height: auto;
        min-height: 100%;
      }

      .timeline-track {
        display: block;
        overflow: visible;
        cursor: default;
        height: auto;
      }

      .timeline-line {
        /* Vertical line for mobile */
        position: absolute;
        top: 0;
        bottom: 0;
        left: 40px;
        width: var(--line-thickness);
        height: 100%;
        background: linear-gradient(
          180deg,
          transparent 0%,
          var(--color-timeline-line) 4%,
          var(--color-timeline-line) 96%,
          transparent 100%
        );
        transform: none;
      }

      .timeline-events-row {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 24px 16px 120px 70px;
        gap: 32px;
        min-width: unset;
        height: auto;
      }

      .timeline-event-slot {
        width: 100%;
        height: auto;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 0;
      }

      .slot-above .event-card-host,
      .slot-below .event-card-host {
        position: relative;
        top: auto;
        bottom: auto;
      }

      .year-pin {
        position: absolute;
        left: -46px;
        top: 20px;
        transform: none;
      }

      .range-bracket {
        top: 27px;
        left: -46px;
        width: 14px;
        height: max(24px, calc((var(--span-slots, 1) - 1) * 78px));
        border-top: 4px solid var(--range-color);
        border-bottom: 4px solid var(--range-color);
        border-left: none;
        border-right: none;
        transform: none;
      }

      .range-bracket-line {
        top: 0;
        bottom: 0;
        left: 50%;
        width: 6px;
        height: 100%;
        transform: translateX(-50%);
      }

      .range-bracket::before,
      .range-bracket::after {
        top: auto;
        bottom: auto;
        left: 0;
        right: auto;
        width: 100%;
        height: 4px;
        border-top: none;
        border-bottom: none;
        border-left: 2px solid var(--range-color);
        border-right: 2px solid var(--range-color);
      }
      
      .range-bracket::before { top: -2px; }
      .range-bracket::after { bottom: -2px; }

      .timeline-event-slot:hover .range-bracket {
        transform: scaleX(1.4);
      }
      .timeline-event-slot:hover .range-bracket-line {
        height: 100%;
        width: 8px;
      }

      app-event-card {
        width: 100%;
      }
    }
  `]
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('trackRef') trackRef!: ElementRef<HTMLDivElement>;

  readonly filterSvc = inject(FilterService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeEvent = signal<TimelineEvent | null>(null);
  isDragging = signal(false);

  private dragStartX = 0;
  private scrollStartX = 0;
  private observers: IntersectionObserver[] = [];
  private animatedIds = new Set<string>();

  tracksCount = signal<number>(1);

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window === 'undefined') return;

    // Reserve vertical space so cards NEVER touch the very top (Header/Titles) 
    // or the very bottom (Filter Panel). Increased to 420px (~210px safe zone top + ~210px safe zone bottom)
    const reservedVerticalSpace = 420;
    const availableHeight = (window.innerHeight - reservedVerticalSpace) / 2;

    // Calculate how many tracks of 64px fit in the available half-screen height (18px base buffer)
    const count = Math.max(1, Math.floor((availableHeight - 18) / 64));
    this.tracksCount.set(Math.min(count, 5)); // max 5 tracks above + 5 below
  }

  // Computed Eras for grouped rendering independent of events
  layoutEras = computed(() => {
    const visibleEvents = TIMELINE_EVENTS.filter(e => this.filterSvc.isEventVisible(e));
    const erasMap = new Map<string, { start: number, end: number }>();

    visibleEvents.forEach((event, index) => {
      if (!erasMap.has(event.era)) {
        erasMap.set(event.era, { start: index, end: index });
      } else {
        erasMap.get(event.era)!.end = index;
      }
    });

    return Array.from(erasMap.entries()).map(([eraName, range]) => ({
      title: eraName,
      color: TIMELINE_ERAS[eraName]?.color || '#94a3b8',
      bgImage: TIMELINE_ERAS[eraName]?.bgImage ? `url('${TIMELINE_ERAS[eraName].bgImage}')` : 'none',
      startIndex: range.start,
      spanSlots: range.end - range.start + 1
    }));
  });

  // Computed layout: assigns each event above/below and trackIndex
  layoutItems = computed(() => {
    const tracks = this.tracksCount();
    const active = this.filterSvc.activeTags();
    const mode = this.filterSvc.filterMode();

    // 1. Filter to strictly visible events ONLY
    const visibleEvents = TIMELINE_EVENTS.filter(e => this.filterSvc.isEventVisible(e));

    // 2. Map their placement
    return visibleEvents.map((event, i) => {
      const position: 'above' | 'below' = i % 2 === 0 ? 'above' : 'below';

      // Calculate tracks per side independently to distribute them evenly
      const trackIndex = (position === 'above')
        ? Math.floor(i / 2) % tracks
        : Math.floor((i - 1) / 2) % tracks;

      // Calculate highly-accurate span across visible slots using floats!
      let spanSlots = 1;
      if (event.yearEnd) {
        let found = false;
        for (let j = i + 1; j < visibleEvents.length; j++) {
          const nextYear = visibleEvents[j].yearStart;
          if (nextYear >= event.yearEnd) {
            const prevYear = visibleEvents[j - 1].yearStart;
            // Prevent division by zero
            const yearDiff = Math.max(1, nextYear - prevYear);
            // Calculate what percentage of this gap the event consumes
            const fraction = Math.max(0, event.yearEnd - prevYear) / yearDiff;
            // span = 1 base slot + full distance slots + the fractional slot remainder!
            spanSlots = 1 + (j - 1 - i) + fraction;
            found = true;
            break;
          }
        }

        // If it extends beyond all visible events on the timeline
        if (!found && visibleEvents.length > i + 1) {
          const lastYear = visibleEvents[visibleEvents.length - 1].yearStart;
          const overflow = Math.max(0, event.yearEnd - lastYear);
          // Visual pad: 1 visual slot width for every 40 excessive years
          spanSlots = 1 + (visibleEvents.length - 1 - i) + (overflow / 40);
        }
      }

      return {
        event,
        position,
        trackIndex,
        spanSlots,
        visible: true,
        animated: this.animatedIds.has(event.id),
      };
    });
  });

  ngOnInit(): void {
    this.onResize();

    // Auto-open modal from URL query param (deep link)
    const eventId = this.route.snapshot.queryParams['event'];
    if (eventId) {
      const found = TIMELINE_EVENTS.find(e => e.id === eventId);
      if (found) {
        // Slight delay so the layout has rendered before opening the modal
        setTimeout(() => this.activeEvent.set(found), 0);
      }
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
  }

  openModal(event: TimelineEvent): void {
    this.activeEvent.set(event);
    this.syncEventUrl(event.id);
  }

  closeModal(): void {
    this.activeEvent.set(null);
    this.syncEventUrl(null);
  }

  // ── Modal Navigation Sequence ──────────────────────────────────
  private get activeIndex(): number {
    const e = this.activeEvent();
    if (!e) return -1;
    // We only sequence through events that are currently NOT hidden by filters
    const visibleItems = this.layoutItems().filter(i => i.visible);
    return visibleItems.findIndex(i => i.event.id === e.id);
  }

  hasPrevUrl(): boolean {
    return this.activeIndex > 0;
  }

  hasNextUrl(): boolean {
    const visibleItems = this.layoutItems().filter(i => i.visible);
    return this.activeIndex >= 0 && this.activeIndex < visibleItems.length - 1;
  }

  goPrevEvent(): void {
    const idx = this.activeIndex;
    if (idx > 0) {
      const visibleItems = this.layoutItems().filter(i => i.visible);
      const prev = visibleItems[idx - 1].event;
      this.activeEvent.set(prev);
      this.syncEventUrl(prev.id);
    }
  }

  goNextEvent(): void {
    const idx = this.activeIndex;
    const visibleItems = this.layoutItems().filter(i => i.visible);
    if (idx >= 0 && idx < visibleItems.length - 1) {
      const next = visibleItems[idx + 1].event;
      this.activeEvent.set(next);
      this.syncEventUrl(next.id);
    }
  }

  /** Sync the event query param in the URL without a full navigation */
  private syncEventUrl(eventId: string | null): void {
    this.router.navigate([], {
      queryParams: { event: eventId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  getRangeColor(event: TimelineEvent): string {
    const RANGE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];
    let hash = 0;
    for (let i = 0; i < event.id.length; i++) {
      hash = event.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return RANGE_COLORS[Math.abs(hash) % RANGE_COLORS.length];
  }

  // ── Drag to scroll ────────────────────────────────────────────
  onMouseDown(event: MouseEvent): void {
    // Don't intercept clicks on cards
    if ((event.target as HTMLElement).closest('app-event-card')) return;
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.scrollStartX = this.trackRef.nativeElement.scrollLeft;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;
    const dx = event.clientX - this.dragStartX;
    this.trackRef.nativeElement.scrollLeft = this.scrollStartX - dx;
  }

  onMouseUp(): void {
    this.isDragging.set(false);
  }

  // ── Wheel scroll normalization ────────────────────────────────
  onWheel(event: WheelEvent): void {
    // Only do horizontal translation on desktop
    if (window.innerWidth <= 768) return;

    // Normalize delta for infinite-scroll mice (Logitech MX, etc.)
    let delta = event.deltaX;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      delta = event.deltaY;
    }

    // Normalize for pixel/line/page modes
    let normalized = delta;
    if (event.deltaMode === 1) normalized *= 40;  // line mode
    if (event.deltaMode === 2) normalized *= 800; // page mode

    this.trackRef.nativeElement.scrollLeft += normalized;
    event.preventDefault();
  }

  // ── IntersectionObserver for card entrance animations ─────────
  private setupIntersectionObserver(): void {
    // Small delay to ensure DOM is rendered
    setTimeout(() => {
      const slots = this.trackRef?.nativeElement.querySelectorAll('.timeline-event-slot');
      if (!slots) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = (entry.target as HTMLElement).dataset['eventId'];
              if (id && !this.animatedIds.has(id)) {
                this.animatedIds.add(id);
                this.cdr.markForCheck();
              }
            }
          });
        },
        {
          root: this.trackRef.nativeElement,
          rootMargin: '0px 100px 0px 100px',
          threshold: 0.1,
        }
      );

      slots.forEach(slot => observer.observe(slot));
      this.observers.push(observer);
    }, 100);
  }
}
