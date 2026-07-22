import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private readonly PREFIX = 'bifi_app_draft_';
  isDraftNavigating = false;

  saveDraft(key: string, data: any): void {
    try {
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  }

  getDraft(key: string): any | null {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('Failed to read draft from localStorage', e);
      return null;
    }
  }

  updateDraftField(key: string, fieldPath: string, value: any): void {
    const draft = this.getDraft(key);
    if (!draft) return;

    const keys = fieldPath.split('.');
    let current = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    const existing = current[lastKey];
    if (Array.isArray(existing)) {
      if (!existing.includes(value)) {
        existing.push(value);
      }
    } else {
      current[lastKey] = value;
    }

    this.saveDraft(key, draft);
  }

  clearDraft(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (e) {
      console.warn('Failed to clear draft from localStorage', e);
    }
  }
}
