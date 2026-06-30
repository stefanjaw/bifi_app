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
import { CrudLanguages } from '../../services/crud-languages';
import { LanguageForm } from '../../services/language-form';
import { LanguageFormModel } from '../../interfaces/language';

/**
 * Create / edit form for Language records.
 * Receives an optional `id` route param; when present it loads and patches the existing record.
 */
@Component({
  selector: 'bifi-app-languages-form',
  providers: [provideResourceManager(CrudLanguages)],
  imports: [FormModule, ReactiveFormsModule, InputText, ProgressBarModule, ToggleSwitchModule],
  templateUrl: './languages-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesForm implements OnInit {
  protected formService = inject(LanguageForm);
  private crudLanguages = inject(CrudLanguages);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Route parameter — present when editing an existing record */
  id = input.required<string>();

  languageResource = this.crudLanguages.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  language = this.languageResource.value;
  form = this.formService.form;
  loading = this.languageResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.language());
  error = this.languageResource.error;

  constructor() {
    effect(() => {
      const lang = this.language();
      if (lang) {
        this.formService.patchValue({
          locale: lang.locale,
          name: lang.name,
          nativeName: lang.nativeName,
          active: lang.active,
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
   * Submits the form — creates a new Language or updates the existing one.
   * @param data - The current form value state
   */
  async handleSubmit(data: FormValueState<LanguageFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;
    const action = this.isUpdate()
      ? this.crudLanguages.put({ _id: this.language()?._id ?? '', data: rawValue })
      : this.crudLanguages.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  /** Navigates back to the languages list */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
