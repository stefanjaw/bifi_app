import { Injectable, signal } from '@angular/core';
import { FormSection } from '@avalantec/base-app/system/modules/form/interfaces/form-navigation';

@Injectable({
  providedIn: 'root',
})
export class FormSections {
  private _sections = signal<FormSection[]>([]);
  sections = this._sections.asReadonly();

  /** which section is currently “active” */
  activeSection = signal<string>('');

  registerSection(section: FormSection) {
    if (!this.activeSection()) this.setActiveSection(section.id);
    this._sections.update((list) => [...list, section]);
  }

  unregisterSection(id: string) {
    this._sections.update((list) => list.filter((s) => s.id !== id));
  }

  setActiveSection(id: string) {
    this.activeSection.set(id);
  }
}
