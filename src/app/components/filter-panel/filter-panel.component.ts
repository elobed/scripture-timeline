import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService, FilterMode } from '../../services/filter.service';
import { TimelineTag } from '../../models/timeline.models';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-panel" [class.collapsed]="collapsed()">
      <div class="filter-header">
        <button class="filter-toggle-btn" (click)="togglePanel()" [attr.aria-expanded]="!collapsed()">
          <span class="filter-toggle-icon">🔍</span>
          <span>Filtros</span>
          <span class="filter-arrow">{{ collapsed() ? '▲' : '▼' }}</span>
        </button>

        <button class="print-btn" (click)="onPrint()" title="Imprimir con código QR">
          🖨️ <span>Imprimir</span>
        </button>
      </div>

      <div class="filter-body" [class.is-open]="!collapsed()">
        <!-- Tag toggles -->
        <div class="filter-tags">
          <button
            *ngFor="let tag of filterSvc.tags"
            class="filter-tag-btn"
            [class.active]="filterSvc.activeTags().has(tag.id)"
            [class.highlighted]="filterSvc.highlightedTags().has(tag.id)"
            [style.--tag-color]="tag.color"
            [style.--tag-bg]="tag.bg"
            [style.--tag-border]="tag.border"
            (click)="onTagClick(tag)"
            (contextmenu)="onTagRightClick($event, tag)"
            [title]="'Click: activar/desactivar | Clic derecho: resaltar'"
            [attr.aria-pressed]="filterSvc.activeTags().has(tag.id)">
            <span class="tag-icon">{{ tag.icon }}</span>
            <span class="tag-label">{{ tag.label }}</span>
            <span *ngIf="filterSvc.highlightedTags().has(tag.id)" class="highlight-dot">★</span>
          </button>
        </div>

        <!-- Filter Controls Row (Logic + Highlights) -->
        <div class="filter-controls-row">
          <!-- Action toggle -->
          <div class="filter-mode">
            <label class="mode-label">Acción:</label>
            <div class="mode-switch">
              <button
                class="mode-btn"
                [class.active]="action() === 'filter'"
                (click)="action.set('filter')"
                title="Filtrar (mostrar/ocultar) tarjetas">
                Filtrar
              </button>
              <button
                class="mode-btn alert"
                [class.active]="action() === 'highlight'"
                (click)="action.set('highlight')"
                title="Resaltar tarjetas en la línea">
                Resaltar
              </button>
            </div>
          </div>

          <!-- Filter mode toggle -->
          <div class="filter-mode" *ngIf="action() === 'filter'">
            <label class="mode-label">Lógica:</label>
            <div class="mode-switch">
              <button
                class="mode-btn"
                [class.active]="filterSvc.filterMode() === 'or'"
                (click)="filterSvc.setFilterMode('or')"
                title="Mostrar si coincide con algún filtro">
                (O)
              </button>
              <button
                class="mode-btn"
                [class.active]="filterSvc.filterMode() === 'and'"
                (click)="filterSvc.setFilterMode('and')"
                title="Mostrar solo si coincide con todos los filtros">
                (Y)
              </button>
            </div>
          </div>

          <!-- Clear highlights button -->
          <button
            *ngIf="filterSvc.hasHighlights()"
            class="clear-highlights-btn"
            (click)="filterSvc.clearHighlights()">
            ✕ Quitar
          </button>
        </div>
      </div>
    </div>

    <!-- QR code for printing (only visible in print) -->
    <div class="print-qr-container" id="print-qr-container">
      <canvas id="qr-canvas"></canvas>
      <div class="qr-label">Escanea para ver esta vista filtrada</div>
      <div class="qr-url" id="qr-url"></div>
    </div>
  `,
  styles: [`
    .filter-panel {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: min(1000px, calc(100vw - 32px));
      background: var(--color-bg-filter);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.1);
      z-index: 90;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: transform var(--transition-slow), background-color var(--transition-normal);
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
    }

    .filter-toggle-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-body);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .filter-toggle-btn:hover { background: var(--color-surface-1); color: var(--color-text-primary); }

    .filter-arrow { color: var(--color-accent); font-size: 0.7rem; }

    .print-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .print-btn:hover { background: var(--color-accent-subtle); color: var(--color-accent); border-color: var(--color-accent); }

    .filter-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
    }

    .filter-body.is-open {
      max-height: 300px;
      padding: 0 16px 16px;
    }

    .filter-tags {
      display: flex;
      flex-wrap: nowrap; /* Force single line */
      overflow-x: auto; /* Allow horizontal scrolling if many tags */
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px; /* space for scrollbar */
      scrollbar-width: thin; /* Firefox */
    }
    
    .filter-tags::-webkit-scrollbar {
      height: 6px;
    }
    .filter-tags::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
    }

    .filter-tag-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      background: var(--color-surface-1);
      color: var(--color-text-muted);
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .filter-tag-btn.active {
      border-color: var(--tag-border, var(--color-accent));
      background: var(--tag-bg, var(--color-accent-subtle));
      color: var(--tag-color, var(--color-accent));
    }

    .filter-tag-btn.highlighted {
      box-shadow: 0 0 0 2px var(--tag-color, var(--color-accent));
    }

    .filter-tag-btn:hover {
      border-color: var(--color-border-strong, #ccc);
      background: var(--color-surface-2);
      color: var(--color-text-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }

    .filter-tag-btn.active:hover {
      filter: brightness(1.05);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }

    .highlight-dot {
      color: var(--color-accent);
      font-size: 0.7rem;
    }

    .filter-controls-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      border-top: 1px solid var(--color-border);
      padding-top: 12px;
    }

    .filter-mode {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mode-label {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .mode-switch {
      display: flex;
      gap: 4px;
      background: var(--color-surface-1);
      border-radius: var(--radius-md);
      padding: 3px;
    }

    .mode-btn {
      padding: 4px 12px;
      border-radius: calc(var(--radius-md) - 2px);
      font-family: var(--font-body);
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .mode-btn.active {
      background: var(--color-bg-card);
      color: var(--color-accent);
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    
    .mode-btn.alert.active {
      color: #ef4444; /* Distinct red/orange for highlight mode */
    }

    .clear-highlights-btn {
      margin-top: 10px;
      padding: 5px 12px;
      border-radius: var(--radius-md);
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      font-family: var(--font-body);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .clear-highlights-btn:hover {
      background: var(--color-surface-1);
      color: var(--color-text-primary);
    }

    /* Print QR section */
    .print-qr-container {
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
    }

    .qr-label {
      font-size: 0.85rem;
      color: #333;
    }

    .qr-url {
      font-size: 0.7rem;
      color: #666;
      word-break: break-all;
      max-width: 250px;
      text-align: center;
    }

    @media screen {
      .print-qr-container { display: none; }
    }

    @media print {
      .filter-panel { display: none !important; }
      .print-qr-container { display: flex !important; }
    }

    @media (max-width: 480px) {
      .filter-tag-btn span.tag-label { display: none; }
      .filter-tag-btn { padding: 6px 10px; }
    }
  `]
})
export class FilterPanelComponent {
  readonly filterSvc = inject(FilterService);
  collapsed = signal(false);
  action = signal<'filter'|'highlight'>('filter');

  togglePanel(): void {
    this.collapsed.update(v => !v);
  }

  onTagClick(tag: TimelineTag): void {
    if (this.action() === 'filter') {
      this.filterSvc.toggleTag(tag.id);
    } else {
      this.filterSvc.toggleHighlight(tag.id);
    }
  }

  onTagRightClick(event: MouseEvent, tag: TimelineTag): void {
    event.preventDefault();
    this.filterSvc.toggleHighlight(tag.id);
  }

  onPrint(): void {
    this.generateQr().then(() => window.print());
  }

  private async generateQr(): Promise<void> {
    const QRCode = await import('qrcode');
    const url = window.location.href;
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    const urlEl = document.getElementById('qr-url');
    const container = document.getElementById('print-qr-container');

    if (canvas) {
      await QRCode.toCanvas(canvas, url, { width: 200, margin: 2 });
    }
    if (urlEl) urlEl.textContent = url;
    // Removed JS display manipulation; handled purely by CSS @media print
  }
}
