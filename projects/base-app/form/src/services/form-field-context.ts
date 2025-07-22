import { Injectable, signal } from '@angular/core';
import { NgControl } from '@angular/forms';

@Injectable()
export class FormFieldContext {
  ngControl = signal<NgControl | null>(null);
  controlId = signal<string | null>(null);
}
