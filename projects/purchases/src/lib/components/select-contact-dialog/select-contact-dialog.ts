import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { contact } from '@avalantec/base-app/interfaces';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'bifi-app-select-contact-dialog',
  imports: [ReactiveFormsModule, DialogModule, SelectModule, FormModule],
  templateUrl: './select-contact-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectContactDialog extends BaseDialog {
  private readonly crudContacts = inject(CrudContacts);

  contactsResource = this.crudContacts.get({
    triggerRequest: this.dialogState,
  });

  contacts = this.contactsResource.value;
  contact = new FormControl<string | null>(null);
  selected = output<contact>();

  override openDialog(): void {
    super.openDialog();
    this.contact.setValue(null);
    this.contactsResource.reload();
  }

  handleSubmit() {
    const contactId = this.contact.value;
    const found = (this.contacts() as contact[])?.find(c => c._id === contactId);
    if (found) {
      this.selected.emit(found);
    }
    this.closeDialog();
  }
}
