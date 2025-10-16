import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { provideResourceManager, TableLayout } from '@avalantec/base-app/resource';
import { CrudRoles } from '../../services/crud-roles';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { RoleForm, roleFormModel } from '../../services/role-form';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectPolicyDialog } from './select-policy-dialog/select-policy-dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { policyColumns } from '@avalantec/base-app/policies';
import { policy } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-roles-form',
  providers: [provideResourceManager(CrudRoles)],
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    TableLayout,
    ProgressBarModule,
    SelectPolicyDialog,
  ],
  templateUrl: './roles-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesForm {
  private readonly crudRoles = inject(CrudRoles);
  private readonly formService = inject(RoleForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<string>();
  policyCols = policyColumns;

  roleResource = this.crudRoles.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  // Role to edit
  role = this.roleResource.value;

  // Form
  form = this.formService.form;

  isUpdate = computed(() => !!this.role());
  loading = this.roleResource.isLoading;
  error = this.roleResource.error;
  policyData = signal<policy<any, any>[]>([]);
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const role = this.role();
      console.log('role ', role);

      if (role) {
        this.formService.patchValue({
          name: role.name,
          policies: role.policies.map(p => p._id),
          active: role.active,
        });
        this.formService.resetDirtyState();
        this.policyData.set(role.policies);
      } else {
        this.formService.reset();
        this.formService.form.controls.policies.clear();
        this.policyData.set([]);
      }
    });
  }

  handleSubmit(values: FormValueState<roleFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudRoles.put({ _id: this.id(), data: values.rawValue })
      : this.crudRoles.post({ data: values.rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);

        this.formService.reset();
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  handlePolicySelect(policies: policy<any, any>[]) {
    this.policyData.update(current => [...current, ...policies]);
    policies.forEach(p => this.form.controls.policies.pushItem(p._id));
  }

  handlePolicyRemove(id: string) {
    this.policyData.update(current => current.filter(p => p._id !== id));

    const index = this.form.controls.policies.value.indexOf(id);
    if (index > -1) {
      this.form.controls.policies.removeAt(index);
    }
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
