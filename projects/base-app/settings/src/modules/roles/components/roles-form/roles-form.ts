import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { provideResourceManager, TableLayout } from '@avalantec/base-app/resource';
import { CrudRoles } from '../../services/crud-roles';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { RoleForm, roleFormModel } from '../../services/role-form';
import { InputTextModule } from 'primeng/inputtext';
import { policyColumns } from '../../../policies';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-roles-form',
  providers: [provideResourceManager(CrudRoles)],
  imports: [ReactiveFormsModule, FormModule, InputTextModule, ButtonModule, TableLayout],
  templateUrl: './roles-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesForm {
  private readonly crudRoles = inject(CrudRoles);
  private readonly formService = inject(RoleForm);

  id = input.required<string>();
  policyCols = policyColumns;

  // Role list
  roleListResource = this.crudRoles.get({ searchParams: computed(() => ({ _id: this.id })) });

  // Role to edit
  role = computed(() => this.roleListResource.value()?.[0]);

  // Form
  form = this.formService.form;

  isEdit = computed(() => !!this.role());
  isLoading = this.roleListResource.isLoading;
  error = this.roleListResource.error;
  policies = computed(() => this.role()?.policies || []);

  constructor() {
    effect(() => {
      const role = this.role();

      if (role) {
        this.formService.patchValue(role);
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<roleFormModel>) {
    // TODO
  }
}
