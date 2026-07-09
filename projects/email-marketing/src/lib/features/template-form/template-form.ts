import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudEmailTemplates } from '../../services/crud-email-templates';
import { EmailTemplateForm, EmailTemplateFormModel } from '../../services/email-template-form';
import { EmailEditor } from '../../components/email-editor/email-editor';

@Component({
  selector: 'bifi-app-template-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ProgressBarModule,
    EmailEditor,
    TranslatePipe,
  ],
  templateUrl: './template-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateForm {
  private crudTemplates = inject(CrudEmailTemplates);
  private formService = inject(EmailTemplateForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  editor = viewChild<EmailEditor>('editor');

  templateResource = this.crudTemplates.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  form = this.formService.form;

  template = this.templateResource.value;
  isUpdate = computed(() => !!this.template());
  loading = this.templateResource.isLoading;
  isSubmitLoading = signal<boolean>(false);
  designJson = signal<any>(null);

  constructor() {
    effect(() => {
      const tpl = this.template();
      if (tpl) {
        this.formService.patchValue({
          name: tpl.name,
          description: tpl.description ?? '',
          category: tpl.category ?? '',
        });
        this.designJson.set(tpl.designJson ?? null);
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<EmailTemplateFormModel>) {
    this.isSubmitLoading.set(true);
    const output = this.editor()?.getOutput();

    const payload: Record<string, any> = {
      ...values.rawValue,
      designJson: output?.designJson ?? null,
      mjml: output?.mjml ?? '',
      html: output?.html ?? '',
    };

    const action = this.isUpdate()
      ? this.crudTemplates.put({ _id: this.id(), data: payload })
      : this.crudTemplates.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../' : '../';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
