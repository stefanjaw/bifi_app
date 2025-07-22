import { DestroyRef, Injector } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NgControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
} from '@angular/forms';
import { isFormControlInvalid } from './form-control-utils';

export class ErrorStateTracker {
  public ngControl!: NgControl;
  public injector!: Injector;
  public updateCallback!: (value: boolean) => void;

  /**
   * Constructs a new ErrorStateTracker instance.
   *
   * @param props object containing all the required properties to initialize this
   *              ErrorStateTracker instance.
   *
   * @throws {Error} if the `ngControl` property is not set or if the `ngControl` property
   *                 is not a {@link NgControl} instance.
   *
   * @throws {Error} if the `injector` property is not set or if the `injector` property
   *                 is not an {@link Injector} instance.
   *
   * @throws {Error} if the `updateCallback` property is not set or if the `updateCallback`
   *                 property is not a function.
   *

   * The `updateCallback` property will be called whenever the error state of the
   * `ngControl` changes.
   */
  constructor(props: Pick<ErrorStateTracker, 'ngControl' | 'injector' | 'updateCallback'>) {
    Object.assign(this, props);

    if (!this.ngControl || !this.ngControl.control) {
      throw new Error('ErrorStateTracker must be used with a valid form control.');
    }

    // Get the control from the ngControl instance.
    // The control is the object that notifies the error state tracker about status changes.
    const { control } = this.ngControl;

    // Get the injector's destroy ref.
    // The destroy ref is used to automatically unsubscribe from the control's events when
    // the component this error state tracker is part of is destroyed.
    const destroyRef = this.injector.get(DestroyRef);

    // Subscribe to the control's events.
    control.events.pipe(takeUntilDestroyed(destroyRef)).subscribe(event => {
      if (
        event instanceof StatusChangeEvent ||
        event instanceof PristineChangeEvent ||
        event instanceof TouchedChangeEvent
      ) {
        // Update the error state.
        this.updateCallback(isFormControlInvalid(control));
      }
    });

    // Update the error state immediately.
    this.updateCallback(isFormControlInvalid(control));
  }
}
