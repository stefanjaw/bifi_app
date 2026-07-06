import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CrudUsers } from '../../services/crud-users';
import { provideResourceManager, TableLayout } from '@avalantec/base-app/resource';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectRoleDialog } from '../select-role-dialog/select-role-dialog';
import { ButtonModule } from 'primeng/button';
import { roleColumns } from '@avalantec/base-app/roles';
import { role } from '@avalantec/base-app/interfaces';
import { CreateUserForm, CreateUserFormModel } from '../../services/create-user-form';
import { ToastManager } from '@avalantec/base-app/core';
import { TranslationService, TranslatePipe } from '@avalantec/base-app/i18n';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'bifi-app-create-users-form',
  providers: [provideResourceManager(CrudUsers)],
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectRoleDialog,
    ButtonModule,
    TableLayout,
    PasswordModule,
    TranslatePipe,
  ],
  templateUrl: './create-users-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUsersForm implements OnInit {
  private readonly crudUsers = inject(CrudUsers);
  private readonly formService = inject(CreateUserForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private toastManager = inject(ToastManager);
  private translationService = inject(TranslationService);

  id = input.required<string>();
  roleCols = roleColumns;

  // Form
  form = this.formService.form;

  // State
  rolesData = signal<role[]>([]);
  isSubmitLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.formService.reset();
  }

  async handleSubmit(values: FormValueState<CreateUserFormModel>) {
    try {
      const { rawValue } = values;

      this.isSubmitLoading.set(true);

      this.crudUsers
        .post({
          data: {
            provider: 'password',
            username: rawValue.username,
            email: rawValue.email,
            contactInformation: {
              name: rawValue.name,
              lastName: rawValue.lastName,
              type: 'individual',
              email: rawValue.email,
              phoneNumber: 'NA',
              active: true,
            },
            roles: rawValue.roles,
            password: rawValue.password,
          },
        })
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitLoading.set(false);
            this.goBack();
          },
          error: () => {
            this.isSubmitLoading.set(false);
          },
        });
    } catch (error) {
      this.toastManager.showError(this.translationService.translate('createForm.error', {}, 'base-app/users'));
      console.error('Error creating user:', error);
    } finally {
      if (this.isSubmitLoading()) this.isSubmitLoading.set(false);
    }
  }

  handleRoleSelect(policy: role) {
    this.rolesData.update(current => [...current, policy]);
    this.form.controls.roles.pushItem(policy._id);
  }

  handleRoleRemove(id: string) {
    this.rolesData.update(current => current.filter(p => p._id !== id));

    const index = this.form.controls.roles.value.indexOf(id);
    if (index > -1) {
      this.form.controls.roles.removeAt(index);
    }
  }

  goBack() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }
}
