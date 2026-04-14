/* eslint-disable @angular-eslint/directive-selector */
import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ResourceRef,
  signal,
} from '@angular/core';
import { PaginationManager } from '../services/pagination-manager';
import { pagination } from '../interfaces/pagination';
import { isPaginated } from '../libraries/pagination-utils';

@Directive({
  selector: '[bifiAppInfiniteScroll]',
})
export class InfiniteScroll {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  // inputs
  resource = input<ResourceRef<any[] | pagination<any>> | null>(undefined, {
    alias: 'bifiAppInfiniteScroll',
  });

  private destroy$ = inject(DestroyRef);
  private paginationManager = inject(PaginationManager);

  // state
  private loadingNextPage = false;
  private handleScroll = (event: Event) => this.onContainerScroll(event);
  private scrollContainer = signal<HTMLElement | null>(null);
  isPaginatedFN = isPaginated;

  /**
   * Walks up the DOM from the given element and returns the first ancestor
   * whose computed overflow-y style is scrollable (auto, scroll, overlay).
   * Falls back to document.documentElement if none is found.
   */
  private findScrollableAncestor(el: HTMLElement): HTMLElement {
    let current = el.parentElement;
    while (current && current !== document.documentElement) {
      const overflowY = getComputedStyle(current).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
        return current;
      }
      current = current.parentElement;
    }
    return document.documentElement;
  }

  /**
   * Constructor for the InfiniteScroll directive.
   * After first render, finds the nearest scrollable ancestor and stores it in a signal.
   * The main effect reacts to both the resource and the scroll container signal, attaching
   * the scroll listener to the outer container instead of the directive's own host element.
   * This allows the table to expand without a height cap while keeping threshold detection
   * correct via the outer scroll container.
   */
  constructor() {
    // After first render, locate and store the nearest scrollable ancestor
    afterNextRender(() => {
      if (!this.el.nativeElement) return;
      this.scrollContainer.set(this.findScrollableAncestor(this.el.nativeElement));
    });

    // Attach/detach scroll listener whenever the resource or scroll container changes
    effect(() => {
      const resource = this.resource();
      const container = this.scrollContainer();

      if (!container) return;

      if (!resource) {
        container.removeEventListener('scroll', this.handleScroll);
        return;
      }

      container.addEventListener('scroll', this.handleScroll, { passive: true });

      return () => {
        container.removeEventListener('scroll', this.handleScroll);
      };
    });

    // Reset the loadingNextPage flag when the resource is no longer loading
    effect(() => {
      const isLoading = this.resource()?.isLoading();

      if (!isLoading) {
        this.loadingNextPage = false;
      }
    });

    // Reset the pagination options
    // this.paginationManager.resetPaginationOptions();

    // Remove scroll event listener on destroy
    this.destroy$.onDestroy(() => {
      this.scrollContainer()?.removeEventListener('scroll', this.handleScroll);
    });
  }

  /**
   * Scroll handler for the container.
   * Checks if the user is at the bottom of the container and loads the next page if so.
   * @param event The scroll event
   */
  private onContainerScroll(event: Event) {
    const state = this.resource();

    if (state?.isLoading() || this.loadingNextPage) return;
    if (!this.isPaginatedFN(state?.value())) return;

    const element = event.target as HTMLElement;

    const scrollTop = element.scrollTop;
    const viewportHeight = element.clientHeight;
    const fullHeight = element.scrollHeight;

    const threshold = 25;

    const atBottom = scrollTop + viewportHeight >= fullHeight - threshold;

    if (atBottom) {
      this.loadNextPage();
    }
  }

  /**
   * Load the next page of data.
   * If the limit is greater or equal to the total number of documents, do nothing.
   * Otherwise, increment the page number and the limit by the pivot value.
   * Set the loadingNextPage flag to true.
   * Call setPaginationOptions on the pagination manager with the updated page and limit.
   */
  private loadNextPage() {
    const state = this.resource();
    if (!this.isPaginatedFN(state?.value())) return;

    const { page, totalDocs, limit } = state.value() as pagination<any>;

    // Si ya tenemos todos los documentos, no hacer nada
    if (limit >= totalDocs) return;

    const pivot = this.paginationManager.PIVOT;

    this.loadingNextPage = true;

    this.paginationManager.setPaginationOptions(page, limit + pivot);
  }
}
