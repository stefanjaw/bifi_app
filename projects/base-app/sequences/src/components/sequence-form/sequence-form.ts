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
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudSequences } from '../../services/crud-sequences';
import { SequenceForm as SequenceFormService, SequenceFormModel } from '../../services/sequence-form';

@Component({
  selector: 'bifi-app-sequence-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    InputNumberModule,
    ToggleSwitchModule,
    ProgressBarModule,
    TextareaModule,
    ButtonModule,
  ],
  templateUrl: './sequence-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SequenceFormComponent {
  private formService = inject(SequenceFormService);
  private crudSequences = inject(CrudSequences);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  form = this.formService.form;

  sequenceResource = this.crudSequences.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  sequence = this.sequenceResource.value;
  isUpdate = computed(() => !!this.sequence());
  isLoading = this.sequenceResource.isLoading;
  isSubmitLoading = signal(false);
  error = this.sequenceResource.error;

  prefix = toSignal(this.form.controls.prefix.valueChanges, {
    initialValue: this.form.controls.prefix.value,
  });
  suffix = toSignal(this.form.controls.suffix.valueChanges, {
    initialValue: this.form.controls.suffix.value,
  });
  number = toSignal(this.form.controls.number.valueChanges, {
    initialValue: this.form.controls.number.value,
  });
  size = toSignal(this.form.controls.size.valueChanges, {
    initialValue: this.form.controls.size.value,
  });

  previewNumber = computed(() => {
    const prefix = this.prefix() ?? '';
    const suffix = this.suffix() ?? '';
    const num = this.number() ?? 1;
    const size = this.size() ?? 6;
    const padded = num.toString().padStart(size, '0');
    return `${prefix}${padded}${suffix}`;
  });

  constructor() {
    effect(() => {
      const seq = this.sequence();
      if (seq) {
        this.formService.patchValue({
          name: seq.name,
          prefix: seq.prefix,
          suffix: seq.suffix ?? '',
          number: seq.number,
          step: seq.step,
          size: seq.size,
          nogap: seq.nogap,
          active: seq.active,
          description: seq.description ?? '',
        });
        this.formService.resetDirtyState();
      } else if (!this.id()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<SequenceFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudSequences.put({ _id: this.sequence()?._id ?? '', data: rawValue as any })
      : this.crudSequences.post({ data: rawValue as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
