/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ErrorStateTracker } from '../libraries/error-state-tracker';

let lastUsedId = 0;

@Directive({
  // Match any element with the form control directive
  selector: '[formControl], [formControlName], [formArray], [formArrayName]',
  host: {
    // Bind the id to the generated ID
    '[id]': 'id()',
  },
})
export class FormControlExtension implements AfterViewInit, OnDestroy {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer2 = inject(Renderer2);
  private injector = inject(Injector);
  protected errorStateTracker: ErrorStateTracker | null = null;

  // The id to assign to the form element
  id = input<string>(`control-${lastUsedId++}`);

  // Whether the control has an error or not
  errorState = signal<boolean>(false);

  // Whether the control is focused or not
  isFocused = signal<boolean>(false);

  // Get the HTML native element
  get nativeElement() {
    return this.element.nativeElement;
  }

  /**
   * Subscribe to the control's events. If the event is a {@link StatusChangeEvent}
   * or a {@link TouchedChangeEvent}, then update the error state.
   */
  ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl);

    // Include the class app-control on the native element
    this.renderer2.addClass(this.nativeElement, 'app-control');

    if (!ngControl.control) {
      // Do not apply the error state tracker if the control is not a form control
      return;
    }

    // Create an error state tracker
    this.errorStateTracker = new ErrorStateTracker({
      injector: this.injector,
      ngControl,
      updateCallback: (value: boolean) => {
        this.errorState.set(value);
      },
    });

    // Add event listeners from the native element
    const el = this.nativeElement;
    if (el) {
      el.addEventListener('focus', this.enableFocus);
      el.addEventListener('blur', this.disableFocus);
    }
  }

  ngOnDestroy(): void {
    this.renderer2.removeClass(this.nativeElement, 'app-control');

    // Remove event listeners from the native element
    const el = this.nativeElement;
    if (el) {
      el.removeEventListener('focus', this.enableFocus);
      el.removeEventListener('blur', this.disableFocus);
    }
  }

  /**
   * Toggle focus tate
   */
  private enableFocus = () => this.isFocused.set(true);
  private disableFocus = () => this.isFocused.set(false);
}
