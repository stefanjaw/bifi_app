import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CrudUsers } from '../../services/crud-users';
import { ProfileForm, ProfileFormModel } from '../../services/profile-form';
import { injectAuthService } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-user-profile',
  imports: [FormModule, ReactiveFormsModule, InputText, ButtonModule, ProgressBarModule],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly crudUsers = inject(CrudUsers);
  private readonly formService = inject(ProfileForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly location = inject(Location);

  private auth = injectAuthService();

  id = computed(() => this.auth.user()?._id || '');

  userResource = this.crudUsers.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== ''),
  });

  // data
  user = this.userResource.value;
  type = computed(() => this.user()?.contactId?.type || 'individual');

  loading = this.userResource.isLoading;
  form = this.formService.form;
  error = this.userResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const user = this.user();

      if (user) {
        this.formService.patchValue({
          username: user.username,
          email: user.email,
          name: user.contactId?.name,
          lastName: user.contactId?.lastName,
          phoneNumber: user.contactId?.phoneNumber,
          contactEmail: user.contactId?.email,
          website: user.contactId?.website,
        });
      } else {
        this.formService.reset();
      }
    });

    effect(() => {
      const type = this.type();

      if (type === 'company') {
        this.form.controls.lastName.setValue('', { emitEvent: false });
        this.form.controls.lastName.disable({ emitEvent: false });
        this.form.controls.website.enable({ emitEvent: false });
      } else {
        this.form.controls.lastName.enable({ emitEvent: false });
        this.form.controls.website.setValue('', { emitEvent: false });
        this.form.controls.website.disable({ emitEvent: false });
      }
    });
  }

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
        type: this.type(),
      },
    };

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
    this.location.back();
  }
}
