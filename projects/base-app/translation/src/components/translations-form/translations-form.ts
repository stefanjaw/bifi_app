import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideResourceManager } from '@avalantec/base-app/resource';
import { CrudTranslations } from '../../services/crud-translations';
import { TranslationForm } from '../../services/translation-form';
import { TranslationFormModel } from '../../interfaces/translation';

/**
 * Create / edit form for Translation records.
 * Receives an optional `id` route param; when present it loads and patches the existing record.
 */
@Component({
  selector: 'bifi-app-translations-form',
  providers: [provideResourceManager(CrudTranslations)],
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule, ToggleSwitchModule],
  templateUrl: './translations-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsForm implements OnInit {
  protected formService = inject(TranslationForm);
  private crudTranslations = inject(CrudTranslations);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Route parameter — present when editing an existing record */
  id = input.required<string>();

  translationResource = this.crudTranslations.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  translation = this.translationResource.value;
  form = this.formService.form;
  loading = this.translationResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.translation());
  error = this.translationResource.error;

  constructor() {
    effect(() => {
      const t = this.translation();
      if (t) {
        this.formService.patchValue({
          locale: t.locale,
          scope: t.scope,
          key: t.key,
          value: t.value,
          active: t.active,
        });
      } else {
        this.formService.reset();
      }
    });
  }

  ngOnInit(): void {
    this.formService.reset();
  }

  /**
   * Submits the form — creates a new Translation or updates the existing one.
   * @param data - The current form value state
   */
  async handleSubmit(data: FormValueState<TranslationFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudTranslations.put({ _id: this.translation()?._id ?? '', data: rawValue })
      : this.crudTranslations.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  /** Navigates back to the translations list */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
