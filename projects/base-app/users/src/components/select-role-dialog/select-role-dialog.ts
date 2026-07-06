import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { FormModule } from '@avalantec/base-app/form';
import { CrudRoles } from '@avalantec/base-app/roles';
import { role } from '@avalantec/base-app/interfaces';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-select-role-dialog',
  imports: [ReactiveFormsModule, DialogModule, SelectModule, FormModule, TranslatePipe],
  templateUrl: './select-role-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRoleDialog extends BaseDialog {
  private readonly crudRoles = inject(CrudRoles);

  rolesResource = this.crudRoles.get({
    triggerRequest: this.dialogState,
  });

  roles = this.rolesResource.value;
  role = new FormControl<string | null>(null);
  selected = output<role>();

  override openDialog(): void {
    super.openDialog();

    // Reload the policies
    this.rolesResource.reload();
  }

  handleSubmit() {
    const roleId = this.role.value;
    const role = this.roles().find(r => r._id === roleId)!;

    this.selected.emit(role);
    this.closeDialog();
  }
}
