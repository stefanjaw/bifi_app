import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  BaseDialog,
  condition,
  conditionOperator,
  policy,
  policyAction,
  ToastManager,
} from '@avalantec/base-app/core';
import { PolicyForm, PolicyFormModel } from '../../services/policy-form';
import { CrudPolicies } from '../../services/crud-policies';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-policy-form-dialog',
  imports: [FormModule, ReactiveFormsModule, DialogModule, SelectModule, InputText, Button],
  templateUrl: './policy-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyFormDialog extends BaseDialog {
  protected formService = inject(PolicyForm);
  private policiesService = inject(CrudPolicies);
  private toastManager = inject(ToastManager);
  private destroy$ = inject(DestroyRef);

  // Outputs
  policySaved = output();

  // Inputs
  policy = input<policy<string, string> | undefined>(undefined);

  // State
  form = this.formService.form;
  isSubmitLoading = signal(false);
  isUpdate = signal(false);

  // Options
  actionOptions: { label: string; value: policyAction }[] = [
    { label: 'Create', value: 'create' },
    { label: 'Read', value: 'read' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
  ];

  conditionOperatorOptions: { label: string; value: conditionOperator }[] = [
    { label: 'Equal', value: '==' },
    { label: 'Not Equal', value: '!=' },
    { label: 'More than', value: '>' },
    { label: 'Less than', value: '<' },
    { label: 'In', value: 'in' },
  ];

  /**
   * @description
   * Handle the policy input change.
   *
   * If policy is not defined, reset the form and set isUpdate to false.
   * If policy is defined, set isUpdate to true and patch the form value
   * with the policy data.
   */
  constructor() {
    super();

    effect(() => {
      const policy = this.policy();

      if (!policy) {
        this.isUpdate.set(false);
        this.formService.reset();
        return;
      }

      this.isUpdate.set(true);

      this.formService.patchValue({
        resource: policy.resource,
        action: policy.action,
        conditions: [
          ...policy.conditions.map(c => ({
            key: c.key as string,
            operator: c.operator,
            value: c.value,
          })),
        ],
      });
    });
  }

  /**
   * Handles submitting the policy form.
   *
   * If the policy is being updated, it will call the policies service put method.
   * If the policy is being created, it will call the policies service post method.
   *
   * @param data - The form value state
   */
  async handleSubmit(data: FormValueState<PolicyFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.policiesService.put({ _id: this.policy()?._id || '', data: rawValue })
      : this.policiesService.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.closeDialog();
        this.policySaved.emit();
        this.toastManager.showSuccess('Policy created successfully');
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  /**
   * Add a new condition to the form.
   *
   * This will add a new condition to the form with default values.
   */
  addCondition(condition: condition<string> | undefined = undefined) {
    this.formService.createCondition(condition);
  }

  /**
   * Remove a condition from the form.
   *
   * This will remove the condition at the given index from the form.
   * @param index The index of the condition to remove.
   */
  removeCondition(index: number) {
    this.form.controls.conditions.removeAt(index);
  }
}
