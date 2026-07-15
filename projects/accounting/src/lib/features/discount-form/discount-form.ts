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
import { CrudDiscounts } from '../../services/crud-discounts';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DiscountFormService, DiscountFormModel } from '../../services/discount-form';
import { PluginSlot, providePluginContext } from '@avalantec/base-app/plugin-system';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-discount-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    ToggleSwitchModule,
    ProgressBarModule,
    InputNumberModule,
    PluginSlot,
    TranslatePipe,
  ],
  providers: [providePluginContext(DiscountForm)],
  templateUrl: './discount-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountForm {
  private formService = inject(DiscountFormService);
  private crudDiscounts = inject(CrudDiscounts);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);

  id = input<string>('');

  discountResource = this.crudDiscounts.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  isUpdate = computed(() => !!this.id());
  isLoading = computed(() => this.discountResource.isLoading());
  isSubmitLoading = signal(false);

  form = this.formService.form;

  private translationService = inject(TranslationService);

  discountTypeOptions = [
    {
      label: this.translationService.translate('options.percentage', {}, 'accounting'),
      value: 'percentage',
    },
    {
      label: this.translationService.translate('options.fixedAmount', {}, 'accounting'),
      value: 'fixed',
    },
  ];

  constructor() {
    effect(() => {
      const entry = this.discountResource.value();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          discountType: entry.discountType,
          value: entry.value,
          active: entry.active ?? true,
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<DiscountFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudDiscounts.put({ _id: this.id(), data: rawValue as any })
      : this.crudDiscounts.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    this.router.navigate(['/accounting/discounts']);
  }
}
