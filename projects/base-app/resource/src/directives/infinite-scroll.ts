/* eslint-disable @angular-eslint/directive-selector */
import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ResourceRef,
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
  resource = input<ResourceRef<any[] | pagination<any>>>(undefined, {
    alias: 'bifiAppInfiniteScroll',
  });

  private destroy$ = inject(DestroyRef);
  private paginationManager = inject(PaginationManager);

  // state
  private loadingNextPage = false;
  private handleScroll = (event: Event) => this.onContainerScroll(event);
  isPaginatedFN = isPaginated;

  /**
   * Constructor for the InfiniteScroll directive.
   * Resets the loadingNextPage flag when the resource is no longer loading.
   * Listens for scroll events on the container element.
   * Resets the pagination options when the component is destroyed.
   */
  constructor() {
    // Reset the loadingNextPage flag when the resource is no longer loading
    effect(() => {
      const isLoading = this.resource()?.isLoading();

      if (!isLoading) {
        this.loadingNextPage = false;
      }
    });

    // Listen for scroll events on the container element
    const scrollContainer = this.el.nativeElement;

    // if there is no scrollContainer, return
    if (!scrollContainer) return;

    // add scroll event listener
    scrollContainer.addEventListener('scroll', this.handleScroll, {
      passive: true,
    });

    // Reset the pagination options
    this.paginationManager.resetPaginationOptions();

    // remove scroll event listener
    this.destroy$.onDestroy(() => {
      scrollContainer.removeEventListener('scroll', this.handleScroll);
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
