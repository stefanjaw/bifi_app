import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { DraftService } from '../services/draft-service';
import { DirtyFormConfirmationService } from '../services/dirty-form-confirmation';

export interface DirtyComponent {
  hasUnsavedChanges(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DirtyFormGuard implements CanDeactivate<DirtyComponent> {
  private draftService = inject(DraftService);
  private confirmationService = inject(DirtyFormConfirmationService);

  async canDeactivate(component: DirtyComponent): Promise<boolean> {
    if (this.draftService.isDraftNavigating) {
      this.draftService.isDraftNavigating = false;
      return true;
    }

    if (component.hasUnsavedChanges()) {
      return this.confirmationService.requestConfirmation();
    }
    return true;
  }
}
