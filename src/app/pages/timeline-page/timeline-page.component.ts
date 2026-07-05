import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [CommonModule, TimelineComponent, FilterPanelComponent],
  template: `
    <section class="timeline-page">
      <app-timeline></app-timeline>
      <app-filter-panel></app-filter-panel>
    </section>
  `,
  styles: [`
    .timeline-page {
      display: flex;
      flex-direction: column;
      flex: 1;
      height: calc(100vh - var(--header-height));
      overflow: hidden;
      position: relative;
    }

    /* On mobile allow vertical scroll */
    @media (max-width: 768px) {
      .timeline-page {
        height: auto;
        min-height: calc(100vh - var(--header-height));
        overflow-y: auto;
      }
    }
  `]
})
export class TimelinePageComponent implements OnInit {
  private filterSvc = inject(FilterService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Restore filter state from URL query params
    const params = this.route.snapshot.queryParams as Record<string, string>;
    this.filterSvc.restoreFromUrl(params);
  }
}
