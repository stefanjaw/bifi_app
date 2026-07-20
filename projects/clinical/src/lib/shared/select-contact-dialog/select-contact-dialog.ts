import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormModule } from '@avalantec/base-app/form';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { contact } from '@avalantec/base-app/interfaces';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-select-contact-dialog',
  imports: [ReactiveFormsModule, DialogModule, SelectModule, FormModule, TranslatePipe],
  templateUrl: './select-contact-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Dialog for selecting a Contact to link to a Staff or Vendor record */
export class SelectContactDialog extends BaseDialog {
  private readonly crud = inject(CrudContacts);

  contactsResource = this.crud.get({
    triggerRequest: this.dialogState,
  });

  contacts = this.contactsResource.value;
  contactControl = new FormControl<string | null>(null);
  selected = output<contact>();

  open(_type?: string): void {
    super.openDialog();
    this.contactsResource.reload();
  }

  handleSubmit(): void {
    const contactId = this.contactControl.value;
    const c = this.contacts()?.find(x => x._id === contactId);
    if (c) this.selected.emit(c);
    this.closeDialog();
  }
}
