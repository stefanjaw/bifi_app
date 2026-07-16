import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule, FormSelectNavigateFooter } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { contact } from '@avalantec/base-app/interfaces';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'bifi-app-select-child-contact-dialog',
  imports: [ReactiveFormsModule, DialogModule, MultiSelectModule, FormModule, TranslatePipe, FormSelectNavigateFooter],
  templateUrl: './select-child-contact-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildContactDialog extends BaseDialog {
  childContactOptions = input.required<contact[]>();
  draftFormValue = input<any>();
  childContact = new FormControl<string[] | null>(null);
  selected = output<contact[]>();

  override openDialog(): void {
    super.openDialog();

    // Reset selection when dialog is opened
    this.childContact.setValue([]);
  }

  handleSubmit() {
    const childContactIds = this.childContact.value;
    const childContacts = this.childContactOptions()
      .filter(c => childContactIds?.includes(c._id))
      .filter(c => !!c);

    this.selected.emit(childContacts);
    this.closeDialog();
  }
}
