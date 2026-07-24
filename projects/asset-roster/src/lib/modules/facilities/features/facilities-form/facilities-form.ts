import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  autoForm,
  DraftService,
  FormModule,
  FormValueState,
  navigateBack,
} from '@avalantec/base-app/form';
import { TableLayout } from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { FacilityForm, FacilityFormModel } from '../../services/facility-form';
import { CrudFacilities } from '../../services/crud-facilities';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { roomColumns } from '../../libraries/room-columns';
import { TranslatePipe } from '@avalantec/base-app/i18n';

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
    TranslatePipe,
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
  private draftService = inject(DraftService);

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

  isUpdate = computed(() => !!this.id());
  loading = computed(() => this.facilityResource.isLoading() || this.contactsResource.isLoading());
  error = this.facilityResource.error;
  isSubmitLoading = signal<boolean>(false);

  hasUnsavedChanges(): boolean {
    return this.formService.hasUnsavedChanges();
  }

  constructor() {
    autoForm(this.form, this.router, this.draftService, this.facility, this.isUpdate, data => {
      this.form.patchValue({
        name: data.name,
        contactId: data.contactId?._id,
      });
      this.formService.resetDirtyState();
    });
  }

  handleSubmit(values: FormValueState<FacilityFormModel>) {
    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudFacilities.put({ _id: this.id(), data: values.dirtyValue })
      : this.crudFacilities.post({ data: values.dirtyValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: (res: any) => {
        this.isSubmitLoading.set(false);
        this.formService.form.markAsUntouched();
        this.formService.form.markAsPristine();
        this.formService.reset();
        this.goBack(res?._id);
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  goBack(createdId?: string) {
    navigateBack(this.route, this.router, this.draftService, createdId, this.isUpdate());
  }
}
