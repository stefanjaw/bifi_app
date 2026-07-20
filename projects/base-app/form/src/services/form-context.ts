import { Injectable, signal } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Injectable()
export class FormContext {
  form = signal<FormGroupDirective | null>(null);
  isPreviewMode = signal<boolean>(false);
}
