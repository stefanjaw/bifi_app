import {
  ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudCondicionVenta } from '../../services/crud-condicion-venta';
import { CondicionVentaFormService, condicionVentaFormModel } from '../../services/condicion-venta-form';

@Component({
  selector: 'bifi-app-condicion-venta-form',
  imports: [ReactiveFormsModule, FormModule, InputTextModule, ButtonModule, ProgressBarModule],
  templateUrl: './condicion-venta-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CondicionesVentaForm {
  private crud = inject(CrudCondicionVenta);
  private formService = inject(CondicionVentaFormService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  resource = this.crud.get({ id: this.id, triggerRequest: computed(() => !!this.id()) });
  form = this.formService.form;
  isUpdate = computed(() => !!this.id());
  loading = this.resource.isLoading;
  error = this.resource.error;
  isSubmitLoading = signal(false);

  constructor() {
    effect(() => {
      const item = this.resource.value();
      if (item) {
        this.formService.patchValue({ code: item.code, description: item.description });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<condicionVentaFormModel>) {
    this.isSubmitLoading.set(true);
    const action = this.isUpdate()
      ? this.crud.put({ _id: this.id(), data: values.rawValue })
      : this.crud.post({ data: values.rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => { this.isSubmitLoading.set(false); this.formService.reset(); this.goBack(); },
      error: () => { this.isSubmitLoading.set(false); },
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
