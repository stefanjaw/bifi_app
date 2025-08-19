import { Signal } from '@angular/core';

export type maybeSignal<T> = T | Signal<T>;
