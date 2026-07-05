import { Injectable, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TAGS_LIST, TIMELINE_EVENTS } from '../data/timeline-events.data';
import { TimelineEvent, TimelineTag } from '../models/timeline.models';

export type FilterMode = 'or' | 'and';

@Injectable({ providedIn: 'root' })
export class FilterService {
  readonly tags: TimelineTag[] = TAGS_LIST;

  // Reactive state
  activeTags = signal<Set<string>>(new Set(TAGS_LIST.map(t => t.id)));
  filterMode = signal<FilterMode>('or');
  highlightedTags = signal<Set<string>>(new Set());

  constructor(private router: Router, private route: ActivatedRoute) {}

  /** Restore state from URL query params */
  restoreFromUrl(params: Record<string, string>): void {
    const tags = params['tags'];
    const mode = params['mode'];
    const highlight = params['highlight'];

    if (tags) {
      const tagIds = tags.split(',').filter(t => this.tags.some(tag => tag.id === t));
      this.activeTags.set(new Set(tagIds));
    }

    if (mode === 'and' || mode === 'or') {
      this.filterMode.set(mode);
    }

    if (highlight) {
      const hIds = highlight.split(',').filter(t => this.tags.some(tag => tag.id === t));
      this.highlightedTags.set(new Set(hIds));
    }
  }

  /** Toggle a tag on/off */
  toggleTag(tagId: string): void {
    const current = new Set(this.activeTags());
    if (current.has(tagId)) {
      current.delete(tagId);
    } else {
      current.add(tagId);
    }
    this.activeTags.set(current);
    this.syncUrl();
  }

  /** Toggle all tags on/off */
  toggleAllTags(active: boolean): void {
    if (active) {
      this.activeTags.set(new Set(this.tags.map(t => t.id)));
    } else {
      this.activeTags.set(new Set());
    }
    this.syncUrl();
  }

  /** Set filter mode */
  setFilterMode(mode: FilterMode): void {
    this.filterMode.set(mode);
    this.syncUrl();
  }

  /** Toggle highlight for a tag (secondary click) */
  toggleHighlight(tagId: string): void {
    const current = new Set(this.highlightedTags());
    if (current.has(tagId)) {
      current.delete(tagId);
    } else {
      current.add(tagId);
    }
    this.highlightedTags.set(current);
    this.syncUrl();
  }

  /** Clear all highlights */
  clearHighlights(): void {
    this.highlightedTags.set(new Set());
    this.syncUrl();
  }

  /** Check if an event is visible given current filter state */
  isEventVisible(event: TimelineEvent): boolean {
    const active = this.activeTags();
    if (active.size === 0) return false;

    if (this.filterMode() === 'and') {
      return Array.from(active).every(tagId => event.tags.includes(tagId));
    } else {
      return event.tags.some(tagId => active.has(tagId));
    }
  }

  /** Check if an event is highlighted */
  isEventHighlighted(event: TimelineEvent): boolean {
    const hl = this.highlightedTags();
    if (hl.size === 0) return false;
    return event.tags.some(tagId => hl.has(tagId));
  }

  /** Check if highlighting is active at all */
  hasHighlights(): boolean {
    return this.highlightedTags().size > 0;
  }

  /** Get visible events */
  getVisibleEvents(): TimelineEvent[] {
    return TIMELINE_EVENTS.filter(e => this.isEventVisible(e));
  }

  private syncUrl(): void {
    const activeTags = Array.from(this.activeTags());
    const highlighted = Array.from(this.highlightedTags());
    const allTagsActive = activeTags.length === this.tags.length;

    const queryParams: Record<string, string | null> = {};

    queryParams['tags'] = allTagsActive ? null : (activeTags.join(',') || null);
    queryParams['mode'] = this.filterMode() === 'or' ? null : this.filterMode();
    queryParams['highlight'] = highlighted.length > 0 ? highlighted.join(',') : null;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
