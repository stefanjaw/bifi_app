import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../services/search-service';
import { SearchDestination } from '../interfaces/search-destination';

@Component({
  selector: 'bifi-app-global-search',
  imports: [CommonModule],
  templateUrl: './global-search.html',
  styleUrl: './global-search.css',
})
export class GlobalSearch {
  private router = inject(Router);
  protected searchService = inject(SearchService);

  private inputEl = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private overlayEl = viewChild<ElementRef<HTMLDivElement>>('overlay');

  query = signal('');
  open = signal(false);
  activeIndex = signal(0);

  results = computed(() => this.searchService.search(this.query()));
  hasQuery = computed(() => this.query().trim().length > 0);

  /** Flat list (in display order) used for keyboard navigation. */
  flatItems = computed(() => this.results().flatMap(group => group.items));

  /** Groups annotated with the global flat index of each item. */
  displayGroups = computed(() => {
    let i = 0;
    return this.results().map(group => ({
      group: group.group,
      items: group.items.map(item => ({ item, index: i++ })),
    }));
  });

  constructor() {
    // Keep the active index within range whenever the result set changes.
    effect(() => {
      const length = this.flatItems().length;
      if (this.activeIndex() >= length) this.activeIndex.set(0);
    });

    // Keep the highlighted result scrolled into view.
    effect(() => {
      const idx = this.activeIndex();
      this.flatItems();
      queueMicrotask(() => {
        const overlay = this.overlayEl()?.nativeElement;
        const el = overlay?.querySelector<HTMLElement>(`[data-result-index="${idx}"]`);
        el?.scrollIntoView({ block: 'nearest' });
      });
    });
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.focusInput();
    }
  }

  onFocus(): void {
    void this.searchService.load();
    this.open.set(true);
  }

  onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
    this.open.set(true);
  }

  onBlur(): void {
    // Defer so a result click registers before the overlay closes.
    setTimeout(() => this.open.set(false), 150);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.flatItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!items.length) return;
        this.open.set(true);
        this.activeIndex.update(i => (i + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!items.length) return;
        this.open.set(true);
        this.activeIndex.update(i => (i - 1 + items.length) % items.length);
        break;
      case 'Enter': {
        event.preventDefault();
        const item = items[this.activeIndex()];
        if (item) this.select(item);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        this.inputEl()?.nativeElement.blur();
        break;
    }
  }

  select(item: SearchDestination): void {
    this.close();
    this.query.set('');
    this.activeIndex.set(0);
    this.inputEl()?.nativeElement.blur();
    if (item.route) this.router.navigateByUrl(item.route);
  }

  private close(): void {
    this.open.set(false);
  }

  private focusInput(): void {
    void this.searchService.load();
    this.open.set(true);
    queueMicrotask(() => this.inputEl()?.nativeElement.focus());
  }
}
