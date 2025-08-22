import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { condition, conditionOperator, policyAction, ToastManager } from '@avalantec/base-app/core';
import { CrudPolicies } from '../../services/crud-policies';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudPolicyForm, PolicyFormModel } from '../../services/crud-policy-form';

@Component({
  selector: 'bifi-app-policy-form-dialog',
  imports: [FormModule, ReactiveFormsModule, SelectModule, InputText, Button, ProgressBarModule],
  host: {
    class: 'flex flex-col gap-3 w-full items-center justify-centern pt-4 pb-4',
  },
  templateUrl: './policy-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyFormDialog implements OnInit {
  protected formService = inject(CrudPolicyForm);
  private policiesService = inject(CrudPolicies);
  private toastManager = inject(ToastManager);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Inputs
  id = signal({ _id: this.route.snapshot.paramMap.get('id') ?? '' });
  policies = this.id()._id !== '' ? this.policiesService.get({ searchParams: this.id }) : null;

  policy = computed(() => {
    const policies = this.policies?.value();

    if (!policies || policies.length === 0) return undefined;

    return policies[0];
  });

  // State
  form = this.formService.form;
  loading = computed(() => (this.policies ? this.policies.isLoading() : false));
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
    effect(() => {
      const policy = this.policy();

      if (!policy) {
        this.isUpdate.set(false);
        this.formService.reset();
        return;
      }

      this.isUpdate.set(true);

      this.formService.patchValue({
        name: policy.name,
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

  ngOnInit(): void {
    this.formService.reset();
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
        this.toastManager.showSuccess('Policy created successfully');
        this.goBack();
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

  /**
   * Navigates back to the list of policies.
   *
   * If the policy is being updated, it will navigate to the list of policies.
   * If the policy is being created, it will navigate to the list of policies.
   */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
