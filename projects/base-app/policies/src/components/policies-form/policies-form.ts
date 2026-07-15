import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CrudPolicies } from '../../services/crud-policies';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { PolicyForm, PolicyFormModel } from '../../services/policy-form';
import { provideResourceManager } from '@avalantec/base-app/resource';
import { condition, conditionOperator } from '@avalantec/base-app/interfaces';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'bifi-app-policy-form-dialog',
  providers: [provideResourceManager(CrudPolicies)],
  imports: [
    FormModule,
    ReactiveFormsModule,
    TranslatePipe,
    SelectModule,
    InputText,
    Button,
    ProgressBarModule,
    RadioButtonModule,
  ],
  templateUrl: './policies-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesForm implements OnInit {
  protected formService = inject(PolicyForm);
  private policiesService = inject(CrudPolicies);
  private translationService = inject(TranslationService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Inputs
  id = input.required<string>();
  policyResource = this.policiesService.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  policy = this.policyResource.value;

  // State
  form = this.formService.form;
  loading = this.policyResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.policy());
  error = this.policyResource.error;

  // Options
  conditionOperatorOptions: { label: string; value: conditionOperator }[] = [];

  /**
   * Sets the form values based on the current policy in the route, if any.
   * If there is no policy, resets the form.
   */
  constructor() {
    this.conditionOperatorOptions = [
      {
        label: this.translationService.translate('operator.equal', {}, 'base-app/policies'),
        value: '==',
      },
      {
        label: this.translationService.translate('operator.notEqual', {}, 'base-app/policies'),
        value: '!=',
      },
      {
        label: this.translationService.translate('operator.moreThan', {}, 'base-app/policies'),
        value: '>',
      },
      {
        label: this.translationService.translate('operator.lessThan', {}, 'base-app/policies'),
        value: '<',
      },
      {
        label: this.translationService.translate('operator.in', {}, 'base-app/policies'),
        value: 'in',
      },
    ];
    effect(() => {
      const policy = this.policy();

      if (policy) {
        this.formService.patchValue({
          name: policy.name,
          resource: policy.resource,
          type: policy.type,
          conditions: [
            ...policy.conditions.map(c => ({
              key: c.key as string,
              operator: c.operator,
              value: c.value,
            })),
          ],
        });
      } else {
        this.formService.reset();
      }
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
   *
   * @param condition - Optional condition to add. Defaults to undefined.
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
