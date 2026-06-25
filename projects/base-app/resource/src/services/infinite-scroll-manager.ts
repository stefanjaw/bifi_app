import { Injectable, signal } from '@angular/core';

/**
 * Configuration for infinite scroll behavior
 */
export interface InfiniteScrollConfig {
  threshold?: number; // pixels from bottom to trigger load
  scrollSelector?: string; // CSS selector for scrollable element
  debounceMs?: number; // debounce time in milliseconds
  autoPaginate?: boolean; // automatically handle pagination
}

/**
 * Service to manage infinite scroll functionality
 * Handles automatic loading of more items when:
 * 1. User scrolls to bottom of container
 * 2. Content doesn't fill the visible area (automatic load)
 * 3. Optionally manages pagination automatically
 */
@Injectable()
export class InfiniteScrollManager {
  private _isEnabled = signal(false);
  private _scrollableElement = signal<HTMLElement | null>(null);

  private _config = signal<InfiniteScrollConfig>({
    threshold: 100,
    scrollSelector: '.p-datatable-wrapper',
    debounceMs: 300,
    autoPaginate: true,
  });

  private _unsub: (() => void)[] = [];
  private _lastLoadTime = 0;
  private _isLoading = false;

  get isEnabled() {
    return this._isEnabled.asReadonly();
  }

  /**
   * Initialize infinite scroll for a given element
   * @param element The container element
   * @param config Configuration options
   * @param onLoadMore Callback when more items should be loaded
   */
  init(element: HTMLElement, config: InfiniteScrollConfig = {}, onLoadMore: () => void) {
    // Clean previous listeners if re-initializing
    this.destroy();

    this._config.set({ ...this._config(), ...config });
    this._scrollableElement.set(element);
    this._isEnabled.set(true);
    this._lastLoadTime = 0;
    this._isLoading = false;

    const scrollable = this._getScrollableContainer(element);

    if (!scrollable) {
      console.warn('InfiniteScrollManager: Could not find scrollable element');
      return;
    }

    this._setupScrollListener(scrollable, onLoadMore);
    this._setupResizeObserver(scrollable, onLoadMore);

    // Initial check in case content already doesn't fill container
    this._checkIfShouldLoad(scrollable, onLoadMore);
  }

  /**
   * Get the scrollable container element
   */
  private _getScrollableContainer(element: HTMLElement): HTMLElement | null {
    const config = this._config();

    if (config.scrollSelector) {
      const found = element.querySelector(config.scrollSelector);
      return (found as HTMLElement) ?? element;
    }

    return element;
  }

  /**
   * Throttle + loading protection
   */
  private _throttledCall(callback: () => void): void {
    if (this._isLoading) return;

    const now = Date.now();
    const debounceMs = this._config().debounceMs ?? 300;

    if (now - this._lastLoadTime >= debounceMs) {
      this._lastLoadTime = now;
      this._isLoading = true;

      try {
        callback();
      } finally {
        // Prevent lock if callback throws
        setTimeout(() => {
          this._isLoading = false;
        }, debounceMs);
      }
    }
  }

  /**
   * Setup scroll listener for bottom detection
   */
  private _setupScrollListener(scrollableElement: HTMLElement, onLoadMore: () => void) {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
      const threshold = this._config().threshold ?? 100;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        this._throttledCall(onLoadMore);
      }
    };

    scrollableElement.addEventListener('scroll', handleScroll);

    this._unsub.push(() => scrollableElement.removeEventListener('scroll', handleScroll));
  }

  /**
   * Setup ResizeObserver to detect when content needs to fill the view
   */
  private _setupResizeObserver(scrollableElement: HTMLElement, onLoadMore: () => void) {
    let resizeTimeout: any;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        this._checkIfShouldLoad(scrollableElement, onLoadMore);
      }, 100);
    });

    resizeObserver.observe(scrollableElement);

    this._unsub.push(() => {
      clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
    });
  }

  /**
   * Check if content fits in container and should auto-load
   */
  private _checkIfShouldLoad(scrollableElement: HTMLElement, onLoadMore: () => void) {
    const { scrollHeight, clientHeight } = scrollableElement;

    // +1 to avoid subpixel rendering issues
    if (scrollHeight <= clientHeight + 1) {
      this._throttledCall(onLoadMore);
      console.log('should load');
    }
  }

  /**
   * Clean up infinite scroll listeners
   */
  destroy() {
    this._unsub.forEach(unsub => unsub());
    this._unsub = [];
    this._isEnabled.set(false);
    this._scrollableElement.set(null);
    this._lastLoadTime = 0;
    this._isLoading = false;
  }
}
