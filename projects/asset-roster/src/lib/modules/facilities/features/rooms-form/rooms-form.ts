import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { RoomForm, RoomFormModel } from '../../services/room-form';
import { CrudRooms } from '../../services/crud-rooms';
import { CrudFacilities } from '../../services/crud-facilities';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  autoForm,
  DraftService,
  DirtyComponent,
  FormModule,
  FormValueState,
  navigateBack,
} from '@avalantec/base-app/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-rooms-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    FormsModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    SelectModule,
    TranslatePipe,
  ],
  templateUrl: './rooms-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsForm implements DirtyComponent {
  private crudRooms = inject(CrudRooms);
  private crudFacilities = inject(CrudFacilities);
  private formService = inject(RoomForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private draftService = inject(DraftService);

  id = input.required<string>();

  // resources
  roomResource = this.crudRooms.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  facilitiesResource = this.crudFacilities.get({});

  form = this.formService.form;

  // data
  room = this.roomResource.value;
  facilities = this.facilitiesResource.value;

  isUpdate = computed(() => !!this.room());
  loading = computed(() => this.roomResource.isLoading() || this.facilitiesResource.isLoading());
  error = this.roomResource.error;
  facilityNameModel = model('');
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    autoForm(
      this.form,
      this.router,
      this.draftService,
      this.room,
      computed(() => !!this.id()),
      data => {
        this.form.patchValue({
          name: data.name,
          code: data.code,
          address: data.address,
          facilityId: data.facilityId?._id,
        });
        this.formService.resetDirtyState();
      }
    );
  }

  handleSubmit(values: FormValueState<RoomFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudRooms.put({ _id: this.id(), data: values.dirtyValue })
      : this.crudRooms.post({ data: values.dirtyValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: (res: any) => {
        this.isSubmitLoading.set(false);
        this.formService.form.markAsUntouched();
        this.formService.form.markAsPristine();
        this.goBack(res?._id);
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  // handleFacilityCreation() {}

  goBack(createdId?: string) {
    navigateBack(this.route, this.router, this.draftService, createdId, this.isUpdate());
  }

  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }
}
