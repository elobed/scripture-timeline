import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimelineEvent } from '../../models/timeline.models';
import { TIMELINE_TAGS } from '../../data/timeline-events.data';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('cardEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.97)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateY(10px) scale(0.97)' }))
      ])
    ])
  ],
  template: `
    <article
      class="event-card"
      [class.is-highlighted]="isHighlighted"
      [class.is-dimmed]="isDimmed"
      [class.is-above]="position === 'above'"
      [class.is-below]="position === 'below'"
      (click)="onCardClick()"
      role="button"
      [attr.aria-label]="'Ver detalles de: ' + event.title"
      tabindex="0"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick(); $event.preventDefault()"
      @cardEnter>

      <!-- State 1: Brief header always visible -->
      <div class="card-header">
        <div class="card-year">{{ event.yearLabel }}</div>
        <h3 class="card-title">{{ event.title }}</h3>
        <div class="card-tags">
          <span
            *ngFor="let tagId of event.tags"
            class="tag-chip icon-only highlight-clickable"
            [style.background]="getTag(tagId)?.bg"
            [style.color]="getTag(tagId)?.color"
            [style.border-color]="getTag(tagId)?.border"
            [title]="getTag(tagId)?.label + ' (Clic para resaltar categoría)'"
            (click)="onTagClick($event, tagId)">
            {{ getTag(tagId)?.icon }}
          </span>
        </div>
      </div>

      <!-- State 2: Detail content revealed on hover -->
      <div class="card-expandable">
        <div class="expandable-inner">
          <div class="card-body-row">
            <div class="card-image-wrap" *ngIf="event.image">
              <img
                [src]="event.image"
                [alt]="event.title"
                class="card-image"
                loading="lazy"
                (error)="onImgError($event)">
            </div>

            <div class="card-content">
              <p class="card-desc">{{ event.shortDesc }}</p>
              <div class="click-more">Clic para más detalles</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden: Full description rendered only during print -->
      <div class="print-desc" [innerHTML]="getPrintSafeHtml()"></div>

      <!-- Connector to timeline line -->
      <div class="card-connector">
        <div class="connector-line"></div>
        <div class="connector-dot"
          [class.has-range]="event.yearEnd !== null">
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Hidden on screen — only visible during @media print */
    .print-desc {
      display: none;
    }
    
    .event-card {
      width: max-content; /* Purely bound by its inline contents */
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      box-shadow: var(--shadow-card);
      transition:
        box-shadow var(--transition-normal),
        opacity var(--transition-normal),
        border-color var(--transition-normal),
        filter var(--transition-normal);
      position: relative;
      flex-shrink: 0;
      z-index: 1;
    }

    .event-card:hover, .event-card:focus-within {
      box-shadow: var(--shadow-hover);
      border-color: var(--color-accent);
      z-index: 10;
    }

    .event-card.is-highlighted {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px var(--color-accent), var(--shadow-hover);
      z-index: 5;
    }

    .event-card.is-dimmed {
      opacity: 0.35;
      filter: grayscale(40%);
    }

    .event-card.is-dimmed:hover {
      opacity: 0.7;
      filter: grayscale(0%);
    }

    .card-header {
      padding: 12px 16px;
      display: flex;
      flex-direction: row; /* One strict line */
      align-items: center;
      gap: 12px;
      background: var(--color-bg-card);
      border-radius: var(--radius-lg);
      position: relative;
      z-index: 2;
    }

    .card-year {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: var(--color-accent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .card-title {
      font-family: var(--font-display);
      font-size: 1.15rem; 
      font-weight: 600;
      line-height: 1.35;
      color: var(--color-text-primary);
      white-space: nowrap; /* strict line */
      flex: 0 1 auto;
    }

    .card-tags {
      display: flex;
      flex-wrap: nowrap; /* Never cascade down */
      justify-content: flex-end;
      gap: 4px;
      flex-shrink: 0;
    }

    .card-expandable {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      width: 0;
      min-width: 100%;
    }

    .event-card:hover .card-expandable,
    .event-card:focus-within .card-expandable {
      grid-template-rows: 1fr;
    }

    .expandable-inner {
      overflow: hidden;
      min-height: 0;
    }

    .card-body-row {
      display: flex;
      flex-direction: row;
      padding: 16px 18px 20px;
      gap: 16px;
      align-items: flex-start;
      background: var(--color-surface-1);
      border-top: 1px solid var(--color-border-light);
      border-bottom-left-radius: var(--radius-lg);
      border-bottom-right-radius: var(--radius-lg);
    }

    .card-image-wrap {
      width: 100px;
      height: 100px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--color-bg-card);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid var(--color-border-light);
      flex-shrink: 0;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .event-card:hover .card-image {
      transform: scale(1.08); /* Smooth zoom */
    }

    .card-content {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tag-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid;
      font-size: 0.68rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.6;
    }

    .tag-chip.icon-only {
      width: 22px;
      height: 22px;
      padding: 0;
      border-radius: 6px;
      font-size: 0.8rem;
    }

    .highlight-clickable {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .highlight-clickable:hover {
      transform: scale(1.15);
      box-shadow: 0 0 0 2px var(--color-bg-card), 0 0 0 4px var(--color-accent);
      z-index: 11;
    }

    .card-desc {
      font-size: 0.88rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .click-more {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .click-more::after {
      content: '→';
      transition: transform 0.2s;
    }
    .event-card:hover .click-more::after {
      transform: translateX(3px);
    }

    /* Connector (hidden on mobile — vertical layout) */
    .card-connector {
      display: none;
    }

    @media (min-width: 769px) {
      .card-connector {
        display: flex;
        align-items: center;
        position: absolute;
        left: 50%;
      }

      .event-card.is-above .card-connector {
        bottom: 0px;
        transform: translate(-50%, 100%);
        flex-direction: column;
      }

      .event-card.is-below .card-connector {
        top: 0px;
        transform: translate(-50%, -100%);
        flex-direction: column-reverse;
      }

      .connector-line {
        width: 2px;
        /* Sync connector length with timeline vertical offsets: 18px base + 64px per track step */
        height: calc(24px + (var(--track-index, 0) * 64px));
        background: var(--color-timeline-line);
      }

      .connector-dot {
        display: none;
      }
    }
  `]
})
export class EventCardComponent {
  @Input({ required: true }) event!: TimelineEvent;
  @Input() position: 'above' | 'below' = 'above';
  @Input() isHighlighted = false;
  @Input() isDimmed = false;
  @Output() cardClicked = new EventEmitter<TimelineEvent>();

  private filterSvc = inject(FilterService);
  private sanitizer = inject(DomSanitizer);

  getPrintSafeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.event.fullDesc ?? '');
  }

  getTag(tagId: string) {
    return TIMELINE_TAGS[tagId as keyof typeof TIMELINE_TAGS];
  }

  onTagClick(e: MouseEvent, tagId: string): void {
    e.stopPropagation();
    this.filterSvc.toggleHighlight(tagId);
  }

  onCardClick(): void {
    this.cardClicked.emit(this.event);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="130" viewBox="0 0 280 130"%3E%3Crect fill="%23ede9e1" width="280" height="130"/%3E%3Ctext fill="%239e9484" font-family="serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
  }
}
