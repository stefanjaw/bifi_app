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
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TableLayout } from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FacilityForm, FacilityFormModel } from '../../services/facility-form';
import { CrudFacilities } from '../../services/crud-facilities';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudContacts } from '@avalantec/base-app/settings';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { roomColumns } from '../../libraries/room-columns';

@Component({
  selector: 'bifi-app-facilities-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    SelectModule,
    TableLayout,
  ],
  templateUrl: './facilities-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacilitiesForm {
  private crudFacilities = inject(CrudFacilities);
  private crudContacts = inject(CrudContacts);
  private formService = inject(FacilityForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  // resources
  facilityResource = this.crudFacilities.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  contactsResource = this.crudContacts.get({});

  form = this.formService.form;

  // data
  facility = this.facilityResource.value;
  contacts = this.contactsResource.value;
  roomColumns = roomColumns;

  isUpdate = computed(() => !!this.facility());
  loading = computed(() => this.facilityResource.isLoading() || this.contactsResource.isLoading());
  error = this.facilityResource.error;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const facility = this.facility();

      if (facility) {
        this.form.patchValue({
          name: facility.name,
          contactId: facility.contactId?._id,
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<FacilityFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudFacilities.put({ _id: this.id(), data: values.dirtyValue })
      : this.crudFacilities.post({ data: values.dirtyValue });

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
