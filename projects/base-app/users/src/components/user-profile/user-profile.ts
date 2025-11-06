import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CrudUsers } from '../../services/crud-users';
import { UpdateUserForm } from '../../services/update-user-form';
import { ProfileForm, ProfileFormModel } from '../../services/profile-form';
import { injectAuthService } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-user-profile',
  imports: [FormModule, ReactiveFormsModule, InputText, ButtonModule],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly crudUsers = inject(CrudUsers);
  private readonly formService = inject(ProfileForm);
  private readonly destroy$ = inject(DestroyRef);

  private auth = injectAuthService();

  type = computed(() => this.auth.user()?.contactId?.type || 'individual');
 
  form = this.formService.form;
  isSubmitLoading = signal<boolean>(false);

  handleSubmit(values: FormValueState<ProfileFormModel>) {
    const { value } = values;
    const data = {
      contactInformation: {
        _id: this.auth.user()?.contactId?._id || '',
        name: value.name,
        lastName: value.lastName,
        phoneNumber: value.phoneNumber,
        email: value.contactEmail,
        website: value.website,
      }
    }

    this.isSubmitLoading.set(true);

    this.crudUsers
      .put({ _id: this.auth.user()?._id || '', data: data })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);

          this.form.markAsPristine(); //set form as pristine after successful submission
          this.form.markAsUntouched();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }

  goBack() {
    window.history.back();
  }
}
