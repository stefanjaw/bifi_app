import { isSignal } from '@angular/core';
import { maybeSignal } from '../interfaces/signal-utils';

export function mayBeSignalValue<T>(value: maybeSignal<T>): T {
  if (isSignal(value)) {
    return value();
  } else {
    return value;
  }
}
