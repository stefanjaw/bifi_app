import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private readonly PREFIX = 'bifi_app_draft_';
  isDraftNavigating = false;

  saveDraft(key: string, data: any, controlName?: string): void {
    try {
      const payload = { data, controlName };
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  }

  getDraft(key: string): any | null {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      if (item) {
        const payload = JSON.parse(item);
        // Fallback for older drafts that didn't have payload structure
        return payload.data !== undefined ? payload.data : payload;
      }
      return null;
    } catch (e) {
      console.warn('Failed to read draft from localStorage', e);
      return null;
    }
  }

  updateDraftControlValue(key: string, value: any): void {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      if (item) {
        const payload = JSON.parse(item);
        if (payload.controlName && payload.data) {
          if (Array.isArray(payload.data[payload.controlName])) {
            const arr = payload.data[payload.controlName];
            if (arr.length === 0 || typeof arr[0] === 'string') {
              arr.push(value);
            }
          } else {
            payload.data[payload.controlName] = value;
          }
          localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(payload));
        }
      }
    } catch (e) {
      console.warn('Failed to update draft control value in localStorage', e);
    }
  }

  clearDraft(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (e) {
      console.warn('Failed to clear draft from localStorage', e);
    }
  }
}
