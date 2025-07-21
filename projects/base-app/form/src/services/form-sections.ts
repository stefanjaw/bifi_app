import { Injectable, signal } from '@angular/core';
import { IFormSection } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormSections {
  private _sections = signal<IFormSection[]>([]);
  sections = this._sections.asReadonly();

  /** which section is currently “active” */
  activeSection = signal<string>('');

  registerSection(section: IFormSection) {
    if (!this.activeSection()) this.setActiveSection(section.id);
    this._sections.update(list => [...list, section]);
  }

  unregisterSection(id: string) {
    this._sections.update(list => list.filter(s => s.id !== id));
  }

  setActiveSection(id: string) {
    this.activeSection.set(id);
  }
}
