import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { DirtyFormConfirmationService } from '../../services/dirty-form-confirmation';

@Component({
  selector: 'bifi-app-dirty-form-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TranslatePipe],
  templateUrl: './dirty-form-confirmation-dialog.html',
})
export class DirtyFormConfirmationDialog {
  confirmationService = inject(DirtyFormConfirmationService);

  get dialogState() {
    return this.confirmationService.isOpen;
  }

  onVisibleChange(visible: boolean) {
    if (!visible) {
      this.confirmationService.reject();
    }
  }
}
