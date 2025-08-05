import { computed, Injectable, signal } from '@angular/core';
import { ControlContainer, NgControl } from '@angular/forms';

@Injectable()
export class FormFieldContext {
  // The NgControl or ControlContainer associated with the form field.
  abstractControl = signal<NgControl | ControlContainer | null>(null);

  // The assigned control id
  controlId = signal<string | null>(null);

  hasControlAttached = computed(() => this.abstractControl() !== null);
}
