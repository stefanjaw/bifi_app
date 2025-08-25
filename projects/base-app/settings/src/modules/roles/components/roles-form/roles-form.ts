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
import { policyColumns } from '../../../policies';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { policy, ToastManager } from '@avalantec/base-app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectPolicyDialog } from './select-policy-dialog/select-policy-dialog';

@Component({
  selector: 'bifi-app-roles-form',
  providers: [provideResourceManager(CrudRoles)],
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ButtonModule,
    TableLayout,
    SelectPolicyDialog,
  ],
  templateUrl: './roles-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesForm {
  private readonly crudRoles = inject(CrudRoles);
  private readonly formService = inject(RoleForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly toastManager = inject(ToastManager);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<string>();
  policyCols = policyColumns;

  // Role list
  roleListResource = this.crudRoles.get({ searchParams: computed(() => ({ _id: this.id })) });

  // Role to edit
  role = computed(() => this.roleListResource.value()?.[0]);

  // Form
  form = this.formService.form;

  isUpdate = computed(() => !!this.role());
  isLoading = this.roleListResource.isLoading;
  error = this.roleListResource.error;
  policyData = signal<policy<any, any>[]>([]);
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const role = this.role();

      if (role) {
        this.formService.patchValue({
          name: role.name,
          policies: role.policies.map(p => p._id),
          active: role.active,
        });
        this.policyData.set(role.policies);
      } else {
        this.formService.reset();
        this.policyData.set([]);
      }
    });
  }

  handleSubmit(values: FormValueState<roleFormModel>) {
    console.log('values', values);
    const action = this.isUpdate()
      ? this.crudRoles.put({ _id: this.id(), data: values.rawValue })
      : this.crudRoles.post({ data: values.rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);

        this.toastManager.showSuccess('Role created successfully');
        this.formService.reset();
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  handlePolicySelect(policy: policy<any, any>) {
    this.policyData.update(current => [...current, policy]);
    this.form.controls.policies.pushItem(policy._id);
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
