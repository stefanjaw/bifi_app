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
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudReporting } from '../../services/crud-reporting';
import { ReportingForm, ReportingFormModel } from '../../services/reporting-form';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { ReportingTemplateEditor } from '../reporting-template-editor/reporting-template-editor';
import { HasPermission } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-reportings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    ProgressBarModule,
    ButtonModule,
    ReportingTemplateEditor,
    HasPermission,
  ],
  templateUrl: './reportings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingsForm implements OnInit {
  editorOptions = {
    theme: 'vs-dark',
    language: 'html',
  };

  private crudReportings = inject(CrudReporting);
  private formService = inject(ReportingForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  reportingResource = this.crudReportings.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  reporting = this.reportingResource.value;

  form = this.formService.form;
  loading = this.reportingResource.isLoading;
  isSubmitLoading = signal(false);
  isReportDownloadLoading = signal(false);
  isUpdate = computed(() => !!this.reporting());
  error = this.reportingResource.error;

  constructor() {
    effect(() => {
      const reporting = this.reporting();

      if (reporting) {
        this.formService.patchValue({
          title: reporting.title,
          model: reporting.model,
          template: reporting.template,
        });
      } else {
        this.formService.reset();
      }
    });
  }

  ngOnInit(): void {
    this.formService.reset();
  }

  async handleSubmit(data: FormValueState<ReportingFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    const action = this.isUpdate()
      ? this.crudReportings.put({ _id: this.reporting()?._id || '', data: rawValue })
      : this.crudReportings.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: newReport => {
        this.isSubmitLoading.set(false);
        this.formService.reset();

        if (!this.isUpdate()) {
          this.router.navigate(['../edit', newReport?._id || ''], {
            relativeTo: this.route,
          });
        } else {
          this.formService.patchValue({
            title: newReport?.title,
            model: newReport?.model,
            template: newReport?.template,
          });
        }
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  async downloadReport() {
    this.isReportDownloadLoading.set(true);
    await this.crudReportings.downloadReport({
      reportId: this.reporting()?._id || '',
      getInactive: false,
    });
    this.isReportDownloadLoading.set(false);
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
