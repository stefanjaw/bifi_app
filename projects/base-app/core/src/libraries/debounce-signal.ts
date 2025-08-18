import { DestroyRef, inject, Injector, Signal } from '@angular/core';
import { toObservable, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

interface debouncedSignalParams<T> {
  signal: Signal<T>;
  injector?: Injector;
  debounce?: number;
}

/**
 * Returns a signal that emits the latest value of the input signal after a debounce period.
 * If the input signal emits a new value before the debounce period has ended, the debounce period is reset.
 *
 * @param signal - The input signal to debounce.
 * @param injector - An optional injector to use for getting the `DestroyRef` token. If not provided, the `DestroyRef` token is injected from the current injector.
 * @param debounce - The debounce period in milliseconds. Defaults to 500ms.
 *
 * @returns A signal that emits the latest value of the input signal after a debounce period.
 */
export function debouncedSignal<T>({ signal, injector, debounce = 500 }: debouncedSignalParams<T>) {
  const destroy$ = injector ? injector.get(DestroyRef) : inject(DestroyRef);
  const debounced$ = toObservable(signal, {
    injector,
  }).pipe(takeUntilDestroyed(destroy$), debounceTime(debounce));

  return toSignal(debounced$, {
    initialValue: signal(),
    injector,
  });
}
