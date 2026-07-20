import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { provideResourceManager } from '@avalantec/base-app/resource';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ProgressBar } from 'primeng/progressbar';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import {
  CareContinuumForm as CareContinuumFormService,
  CareContinuumFormModel,
} from '../../services/care-continuum-form';
import { CrudCareContinuum } from '../../services/crud-care-continuum';

@Component({
  selector: 'bifi-app-care-continuum-form',
  providers: [provideResourceManager(CrudCareContinuum)],
  imports: [
    FormModule,
    ReactiveFormsModule,
    TranslatePipe,
    InputTextModule,
    SelectModule,
    ButtonModule,
    InputNumber,
    ToggleSwitch,
    ProgressBar,
  ],
  templateUrl: './care-continuum-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Create/edit page for care continuum records */
export class CareContinuumsFormPage implements OnInit {
  protected formService = inject(CareContinuumFormService);
  private crud = inject(CrudCareContinuum);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = this.route.snapshot.paramMap.get('id') ?? '';
  resource = this.crud.get({ id: this.id, triggerRequest: computed(() => !!this.id) });
  entity = this.resource.value;

  form = this.formService.form;
  loading = this.resource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.entity());

  constructor() {
    effect(() => {
      const data = this.entity();
      if (data) this.formService.patchValue(data);
      else this.formService.reset();
    });
  }

  ngOnInit(): void {
    this.formService.reset();
  }

  /** Handles form submission for create or update */
  async handleSubmit(data: FormValueState<CareContinuumFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crud.put({ _id: this.entity()?._id || '', data: rawValue })
      : this.crud.post({ data: rawValue });
    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  /** Navigates back to the list view */
  goBack() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }
}
