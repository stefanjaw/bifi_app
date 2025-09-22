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
import { RoomForm, RoomFormModel } from '../../services/room-form';
import { CrudRooms } from '../../services/crud-rooms';
import { CrudFacilities } from '../../services/crud-facilities';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'bifi-app-rooms-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    SelectModule,
  ],
  templateUrl: './rooms-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsForm {
  private crudRooms = inject(CrudRooms);
  private crudFacilities = inject(CrudFacilities);
  private formService = inject(RoomForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const room = this.room();

      if (room) {
        this.form.patchValue({
          name: room.name,
          code: room.code,
          address: room.address,
          facilityId: room.facilityId?._id,
        });
        this.formService.resetDirtyState();
      } else {
        this.form.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<RoomFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudRooms.put({ _id: this.id(), data: values.dirtyValue })
      : this.crudRooms.post({ data: values.dirtyValue });

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

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
