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
import { CrudUsers } from '../../services/crud-users';
import { provideResourceManager, TableLayout } from '@avalantec/base-app/resource';
import { UpdateUserForm, UpdateUserFormModel } from '../../services/update-user-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectRoleDialog } from '../select-role-dialog/select-role-dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { roleColumns } from '@avalantec/base-app/roles';
import { role } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-update-users-form',
  providers: [provideResourceManager(CrudUsers)],
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ProgressBarModule,
    SelectRoleDialog,
    ButtonModule,
    TableLayout,
    SelectModule,
  ],
  templateUrl: './update-users-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUsersForm {
  private readonly crudUsers = inject(CrudUsers);
  private readonly crudContacts = inject(CrudContacts);
  private readonly formService = inject(UpdateUserForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id = input.required<string>();
  roleCols = roleColumns;

  userResource = this.crudUsers.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  contactsResource = this.crudContacts.get({});

  // Data
  user = this.userResource.value;
  contacts = this.contactsResource.value;

  // Form
  form = this.formService.form;

  // isUpdate = computed(() => !!this.user()); its gonna be always update
  loading = computed(() => this.userResource.isLoading() || this.contactsResource.isLoading());
  error = this.userResource.error;
  rolesData = signal<role[]>([]);
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const user = this.user();

      if (user) {
        this.formService.patchValue({
          username: user.username,
          email: user.email,
          picture: user.picture,
          roles: user.roles.map(role => role._id),
          contactId: user.contactId?._id || '',
        });
        this.formService.resetDirtyState();
        this.rolesData.set(user.roles);
      } else {
        this.formService.reset();
        this.rolesData.set([]);
      }
    });
  }

  handleSubmit(values: FormValueState<UpdateUserFormModel>) {
    const { value } = values;

    this.isSubmitLoading.set(true);

    this.crudUsers
      .put({ _id: this.id(), data: value })
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
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }
}
