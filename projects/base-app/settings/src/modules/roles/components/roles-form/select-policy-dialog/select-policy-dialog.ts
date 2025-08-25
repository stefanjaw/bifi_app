import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, policy } from '@avalantec/base-app/core';
import { FormModule } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { CrudPolicies } from '../../../../policies';

@Component({
  selector: 'bifi-app-select-policy-dialog',
  imports: [ReactiveFormsModule, DialogModule, SelectModule, FormModule],
  templateUrl: './select-policy-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPolicyDialog extends BaseDialog {
  private readonly crudPolicies = inject(CrudPolicies);

  private policyResource = this.crudPolicies.get({
    triggerRequest: this.dialogState, // Only trigger the request when the dialog is opened
  });

  policies = this.policyResource.value;
  policy = new FormControl<string | null>(null);
  selected = output<policy<any, any>>();

  override openDialog(): void {
    super.openDialog();

    // Reload the policies
    this.policyResource.reload();
  }

  handleSubmit() {
    const policyId = this.policy.value;
    const policy = this.policies().find(p => p._id === policyId)!;

    this.selected.emit(policy);
    this.closeDialog();
  }
}
