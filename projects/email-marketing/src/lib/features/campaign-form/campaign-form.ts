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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudEmailCampaigns } from '../../services/crud-email-campaigns';
import { CrudMailingLists } from '../../services/crud-mailing-lists';
import { CrudEmailTemplates } from '../../services/crud-email-templates';
import {
  EmailCampaignForm,
  EmailCampaignFormModel,
} from '../../services/email-campaign-form';
import { emailCampaign } from '../../interfaces/email-campaign';
import { mailingList } from '../../interfaces/mailing-list';
import { emailTemplate } from '../../interfaces/email-template';
import { EmailEditor } from '../../components/email-editor/email-editor';

@Component({
  selector: 'bifi-app-campaign-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    ProgressBarModule,
    MessageModule,
    DialogModule,
    EmailEditor,
  ],
  templateUrl: './campaign-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignForm {
  private crudCampaigns = inject(CrudEmailCampaigns);
  private crudLists = inject(CrudMailingLists);
  private crudTemplates = inject(CrudEmailTemplates);
  private formService = inject(EmailCampaignForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  editor = viewChild<EmailEditor>('editor');

  campaignResource = this.crudCampaigns.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  private listsResource = this.crudLists.get({
    id: signal(''),
    getInactive: signal(false),
  });

  private templatesResource = this.crudTemplates.get({
    id: signal(''),
    getInactive: signal(false),
  });

  listOptions = computed<mailingList[]>(() => {
    const data = this.listsResource.value();
    return Array.isArray(data) ? data : [];
  });

  templateOptions = computed<emailTemplate[]>(() => {
    const data = this.templatesResource.value();
    return Array.isArray(data) ? data : [];
  });

  form = this.formService.form;

  campaign = this.campaignResource.value;
  isUpdate = computed(() => !!this.campaign());
  loading = this.campaignResource.isLoading;
  isSubmitLoading = signal<boolean>(false);
  designJson = signal<any>(null);

  status = computed(() => this.campaign()?.status ?? 'draft');
  isEditable = computed(() => {
    const s = this.status();
    return s === 'draft' || s === 'scheduled';
  });

  actionMessage = signal<{ ok: boolean; message: string } | null>(null);
  actionLoading = signal(false);

  testDialogVisible = signal(false);
  testEmail = signal('');
  scheduleDialogVisible = signal(false);
  scheduleDate = signal<Date | null>(null);

  constructor() {
    effect(() => {
      const c = this.campaign();
      if (c) {
        this.formService.patchValue({
          name: c.name,
          subject: c.subject,
          previewText: c.previewText ?? '',
          fromName: c.fromName ?? '',
          fromEmail: c.fromEmail ?? '',
          replyTo: c.replyTo ?? '',
          listIds: this.resolveIds(c.listIds),
          templateId: this.resolveId(c.templateId),
        });
        this.designJson.set(c.designJson ?? null);
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  private resolveId(value: string | emailTemplate | undefined): string {
    if (!value) return '';
    return typeof value === 'object' ? value._id : value;
  }

  private resolveIds(values: (string | mailingList)[] | undefined): string[] {
    if (!values) return [];
    return values.map(v => (typeof v === 'object' ? v._id : v));
  }

  onTemplateChange(templateId: string) {
    const tpl = this.templateOptions().find(t => t._id === templateId);
    if (tpl?.designJson) {
      this.designJson.set(tpl.designJson);
    }
  }

  private buildPayload(values: EmailCampaignFormModel): Record<string, any> {
    const output = this.editor()?.getOutput();
    return {
      ...values,
      designJson: output?.designJson ?? null,
      mjml: output?.mjml ?? '',
      html: output?.html ?? '',
    };
  }

  handleSubmit(values: FormValueState<EmailCampaignFormModel>) {
    this.isSubmitLoading.set(true);
    const payload = this.buildPayload(values.rawValue);

    const action = this.isUpdate()
      ? this.crudCampaigns.put({ _id: this.id(), data: payload })
      : this.crudCampaigns.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  private saveCurrent() {
    const payload = this.buildPayload(this.form.getRawValue() as EmailCampaignFormModel);
    return this.crudCampaigns.put({ _id: this.id(), data: payload });
  }

  openTestDialog() {
    this.actionMessage.set(null);
    this.testDialogVisible.set(true);
  }

  sendTest() {
    if (!this.id() || !this.testEmail()) return;
    this.actionLoading.set(true);
    this.saveCurrent()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.crudCampaigns
            .sendTest(this.id()!, this.testEmail())
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: res => {
                this.actionLoading.set(false);
                this.testDialogVisible.set(false);
                this.actionMessage.set(res);
              },
              error: err => {
                this.actionLoading.set(false);
                this.actionMessage.set({
                  ok: false,
                  message: err?.error?.message ?? 'Failed to send test',
                });
              },
            });
        },
        error: () => this.actionLoading.set(false),
      });
  }

  sendNow() {
    if (!this.id()) return;
    this.actionLoading.set(true);
    this.actionMessage.set(null);
    this.saveCurrent()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.crudCampaigns
            .sendNow(this.id()!)
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: () => {
                this.actionLoading.set(false);
                this.actionMessage.set({ ok: true, message: 'Campaign is being sent.' });
                this.campaignResource.reload();
              },
              error: err => {
                this.actionLoading.set(false);
                this.actionMessage.set({
                  ok: false,
                  message: err?.error?.message ?? 'Failed to send campaign',
                });
              },
            });
        },
        error: () => this.actionLoading.set(false),
      });
  }

  openScheduleDialog() {
    this.actionMessage.set(null);
    this.scheduleDialogVisible.set(true);
  }

  confirmSchedule() {
    const date = this.scheduleDate();
    if (!this.id() || !date) return;
    this.actionLoading.set(true);
    this.saveCurrent()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.crudCampaigns
            .schedule(this.id()!, date.toISOString())
            .pipe(takeUntilDestroyed(this.destroy$))
            .subscribe({
              next: () => {
                this.actionLoading.set(false);
                this.scheduleDialogVisible.set(false);
                this.actionMessage.set({ ok: true, message: 'Campaign scheduled.' });
                this.campaignResource.reload();
              },
              error: err => {
                this.actionLoading.set(false);
                this.actionMessage.set({
                  ok: false,
                  message: err?.error?.message ?? 'Failed to schedule campaign',
                });
              },
            });
        },
        error: () => this.actionLoading.set(false),
      });
  }

  cancelCampaign() {
    if (!this.id()) return;
    this.actionLoading.set(true);
    this.crudCampaigns
      .cancel(this.id()!)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.actionLoading.set(false);
          this.actionMessage.set({ ok: true, message: 'Campaign cancelled.' });
          this.campaignResource.reload();
        },
        error: err => {
          this.actionLoading.set(false);
          this.actionMessage.set({
            ok: false,
            message: err?.error?.message ?? 'Failed to cancel campaign',
          });
        },
      });
  }

  goBack() {
    const route = this.isUpdate() ? '../../' : '../';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
