import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  ResourceRef,
  signal,
} from '@angular/core';
import {
  BaseDialog,
  conditionOperator,
  policy,
  policyAction,
  ToastManager,
} from '@avalantec/base-app/core';
import { PolicyForm, PolicyFormModel } from '../../services/policy-form';
import { ActivatedRoute } from '@angular/router';
import { CrudPolicies } from '../../services/crud-policies';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

@Component({
  selector: 'bifi-app-policy-form-dialog',
  imports: [FormModule, ReactiveFormsModule, DialogModule, SelectModule, InputText, Button],
  templateUrl: './policy-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyFormDialog extends BaseDialog {
  protected formService = inject(PolicyForm);
  private policysService = inject(CrudPolicies);
  private toastManager = inject(ToastManager);
  private destroy$ = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  id = input('');
  searchParams = computed(() => ({ _id: this.id() ?? '' }));

  // Data
  policies!: ResourceRef<policy<string, string>[]> | undefined;

  // Computed
  policy = computed(() => {
    if (
      this.policies?.isLoading() ||
      !this.policies?.hasValue() ||
      this.policies.value().length === 0
    )
      return null;

    return this.policies.value()[0];
  });

  // State
  form = this.formService.form;
  isLoading = this.policies?.isLoading || signal(false);
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
   * Handles fetching the policy when the id input changes.
   *
   * Patches the form with the policy data when it is loaded.
   */
  constructor() {
    super();

    effect(() => {
      const id = this.id();

      if (!id) return;

      if (!this.policies)
        this.policies = this.policysService.get({ searchParams: this.searchParams });
      else this.policies.reload();
    });

    effect(() => {
      const policy = this.policy();

      if (!policy) return;

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

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  async handleSubmit(data: FormValueState<PolicyFormModel>) {
    console.log(data);
  }

  /**
   * Add a new condition to the form.
   *
   * This will add a new condition to the form with default values.
   */
  addCondition() {
    this.formService.patchValue({
      conditions: [
        ...this.form.controls.conditions.value,
        {
          key: '',
          operator: '==',
          value: '',
        },
      ],
    });
  }

  /**
   * Remove a condition from the form.
   *
   * This will remove the condition at the given index from the form.
   * @param index The index of the condition to remove.
   */
  removeCondition(index: number) {
    this.form.controls.conditions.value.splice(index);
  }
}
