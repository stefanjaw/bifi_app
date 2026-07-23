import { Injectable } from '@angular/core';

/**
 * Reviver function for JSON.parse that converts ISO date strings back to Date objects.
 * Only strings matching the full ISO 8601 format are converted.
 */
function isoDateReviver(_key: string, value: unknown): unknown {
  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(value)
  ) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
}

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private readonly PREFIX = 'bifi_app_draft_';

  /** Flag checked by DirtyFormGuard to skip the "unsaved changes" dialog when returning from a cross-form create */
  isDraftNavigating = false;

  /**
   * Saves form state to localStorage under a key prefixed with the app name.
   * @param key - The URL or identifier for the draft
   * @param data - The form value object to persist
   */
  saveDraft(key: string, data: unknown, dirtyKeys?: string[]): void {
    try {
      const payload = { _v: 2, data, dirtyKeys };
      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  }

  /**
   * Retrieves and parses a draft from localStorage. ISO date strings are
   * automatically converted back to Date objects via isoDateReviver.
   * @param key - The URL or identifier used when saving the draft
   * @returns The parsed draft object, or null if not found or corrupted
   */
  getDraft(key: string): { data: Record<string, unknown>; dirtyKeys?: string[] } | null {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      if (!item) return null;
      const parsed = JSON.parse(item, isoDateReviver);
      if (parsed && typeof parsed === 'object' && (parsed as any)._v === 2) {
        return parsed as { data: Record<string, unknown>; dirtyKeys?: string[] };
      }
      return { data: parsed as Record<string, unknown> };
    } catch (e) {
      console.warn('Failed to read draft from localStorage', e);
      return null;
    }
  }

  /**
   * Patches a single field into an existing draft. Supports dot-notation paths
   * for nested fields. If the target field is an array, the value is appended
   * (deduplicated). Used by navigateBack to set the created entity ID.
   * @param key - The draft key
   * @param fieldPath - Dot-notation path to the field (e.g. "locationAssignments.0.locationId")
   * @param value - The value to write
   */
  updateDraftField(key: string, fieldPath: string, value: unknown): void {
    const draftWrapper = this.getDraft(key);
    if (!draftWrapper) return;

    const draft = draftWrapper.data;

    const keys = fieldPath.split('.');
    let current: Record<string, unknown> = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
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

    let dirtyKeys = draftWrapper.dirtyKeys;
    if (dirtyKeys) {
      if (!dirtyKeys.includes(fieldPath)) {
        dirtyKeys.push(fieldPath);
      }
    } else {
      dirtyKeys = [fieldPath];
    }

    this.saveDraft(key, draft, dirtyKeys);
  }

  /**
   * Removes a draft from localStorage by key.
   * @param key - The draft key to remove
   */
  clearDraft(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (e) {
      console.warn('Failed to clear draft from localStorage', e);
    }
  }
}
