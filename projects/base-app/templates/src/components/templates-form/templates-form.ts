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
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { FormCodeEditor } from '@avalantec/base-app/form';
import { TranslatePipe } from '@avalantec/base-app/translation';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { CrudTemplates } from '../../services/crud-templates';
import { TemplateForm, TemplateFormModel } from '../../services/template-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AccessTokenDialog } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-templates-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    FormCodeEditor,
    InputTextModule,
    ProgressBarModule,
    ButtonModule,
    SelectModule,
    AccessTokenDialog,
    TranslatePipe,
  ],
  templateUrl: './templates-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesForm implements OnInit {
  mimeTypeOptions = [
    'text/typescript',
    'application/typescript',
    'application/javascript',
    'text/javascript',
    'text/html',
    'text/css',
  ];

  private crudTemplate = inject(CrudTemplates);
  private formService = inject(TemplateForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  templateResource = this.crudTemplate.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  template = this.templateResource.value;

  form = this.formService.form;
  loading = this.templateResource.isLoading;
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.template());
  error = this.templateResource.error;

  mimeType = toSignal(this.form.controls.mimeType.valueChanges);

  constructor() {
    effect(() => {
      const template = this.template();

      if (template) {
        this.formService.patchValue({
          name: template.name,
          codeOriginal: template.codeOriginal,
          codeCustom: template.codeCustom,
          directory: template.directory,
          filename: template.filename,
          mimeType: template.mimeType,
        });
      } else {
        this.formService.reset();
      }
    });
  }

  ngOnInit(): void {
    this.formService.reset();
  }

  async handleSubmit(data: FormValueState<TemplateFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudTemplate.put({ _id: this.template()?._id || '', data: rawValue })
      : this.crudTemplate.post({ data: rawValue });

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
