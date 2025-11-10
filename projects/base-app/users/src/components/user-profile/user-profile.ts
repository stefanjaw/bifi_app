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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileResolver } from '@avalantec/base-app/resource';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'bifi-app-user-profile',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    FileUploadModule,
  ],
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly crudUsers = inject(CrudUsers);
  private readonly formService = inject(ProfileForm);
  private readonly destroy$ = inject(DestroyRef);
  private readonly location = inject(Location);
  private fileResolver = inject(FileResolver);

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

  // for picture
  pictureUrl = signal<string | undefined>(undefined);
  uploadedPictureIdSignal = toSignal(this.form.controls.uploadedPictureId.valueChanges);

  constructor() {
    effect(async () => {
      const user = this.user();

      const parsedPicture = user?.uploadedPictureId
        ? await this.fileResolver.resolveFile({
            id: user.uploadedPictureId,
          })
        : null;

      this.pictureUrl.set(parsedPicture ? URL.createObjectURL(parsedPicture) : user?.picture);

      if (user) {
        this.formService.patchValue({
          username: user.username,
          email: user.email,
          name: user.contactId?.name,
          lastName: user.contactId?.lastName,
          phoneNumber: user.contactId?.phoneNumber,
          contactEmail: user.contactId?.email,
          website: user.contactId?.website,
          ...((parsedPicture && {
            uploadedPictureId: [
              {
                id: user.uploadedPictureId,
                file: parsedPicture,
              },
            ],
          }) || {
            uploadedPictureId: [],
          }),
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

    effect(() => {
      const uploadedPictureId = this.uploadedPictureIdSignal();

      this.pictureUrl.set(
        uploadedPictureId && uploadedPictureId.length > 0 && uploadedPictureId[0].file
          ? URL.createObjectURL(uploadedPictureId[0].file)
          : this.user()?.picture
      );
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
      uploadedPictureId: value.uploadedPictureId || undefined,
    };

    this.isSubmitLoading.set(true);

    this.crudUsers
      .put({ _id: this.auth.user()?._id || '', fileFields: ['uploadedPictureId'], data: data })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          window.location.reload();
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
