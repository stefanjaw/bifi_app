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
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudFiscalPositions } from '../../services/crud-fiscal-positions';
import { CrudTaxes } from '@avalantec/base-app/taxes';
import { CrudAccounts } from '../../services/crud-accounts';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FiscalPositionFormService,
  FiscalPositionFormModel,
} from '../../services/fiscal-position-form';

@Component({
  selector: 'bifi-app-fiscal-position-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    ToggleSwitchModule,
    ProgressBarModule,
    ButtonModule,
  ],
  templateUrl: './fiscal-position-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiscalPositionForm {
  private formService = inject(FiscalPositionFormService);
  private crudFiscalPositions = inject(CrudFiscalPositions);
  private crudTaxes = inject(CrudTaxes);
  private crudAccounts = inject(CrudAccounts);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  fiscalPositionResource = this.crudFiscalPositions.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  taxesResource = this.crudTaxes.get({});
  accountsResource = this.crudAccounts.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.fiscalPositionResource.isLoading() ||
      this.taxesResource.isLoading() ||
      this.accountsResource.isLoading()
  );
  isSubmitLoading = signal(false);

  form = this.formService.form;
  taxes = this.taxesResource.value;
  accounts = this.accountsResource.value;

  get taxMappings(): FormGroup[] {
    return this.formService.taxMappings;
  }

  get accountMappings(): FormGroup[] {
    return this.formService.accountMappings;
  }

  addTaxMapping() {
    this.formService.addTaxMapping();
  }

  removeTaxMapping(index: number) {
    this.formService.removeTaxMapping(index);
  }

  addAccountMapping() {
    this.formService.addAccountMapping();
  }

  removeAccountMapping(index: number) {
    this.formService.removeAccountMapping(index);
  }

  constructor() {
    effect(() => {
      const entry = this.fiscalPositionResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          active: entry.active ?? true,
          taxMappings: (entry.taxMappings ?? []).map((m: any) => ({
            fromTaxId: m.fromTaxId?._id ?? '',
            toTaxId: m.toTaxId?._id ?? '',
          })),
          accountMappings: (entry.accountMappings ?? []).map((m: any) => ({
            fromAccountId: m.fromAccountId?._id ?? '',
            toAccountId: m.toAccountId?._id ?? '',
          })),
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<FiscalPositionFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudFiscalPositions.put({ _id: this.id(), data: rawValue as any })
      : this.crudFiscalPositions.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/fiscal-positions']);
  }
}
