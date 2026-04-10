import { Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BaseDialog } from '@avalantec/base-app/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-buttons-confirmation-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './buttons-confirmation-dialog.html',
})
export class ButtonsConfirmationDialog extends BaseDialog {
  confirmClicked = output<void>();
  resource = input<string>();

  override openDialog(): void {
    super.openDialog();
  }

  confirm() {
    this.confirmClicked.emit();
  }
}
