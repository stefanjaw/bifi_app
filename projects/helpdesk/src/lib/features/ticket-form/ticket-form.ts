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
import { CrudTickets } from '../../services/crud-tickets';
import { CrudHelpdeskStages } from '../../services/crud-helpdesk-stages';
import { TicketForm, TicketFormModel } from '../../services/ticket-form';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudUsers } from '@avalantec/base-app/users';
import { CrudTasks } from '@avalantec/tasks';
import { ticket, ticketAttachment } from '../../interfaces/ticket';
import { LocaleDatePipe, TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import {
  activityHistory,
  CrudActivityHistories,
  FileResolver,
  orderByQuery,
} from '@avalantec/base-app/resource';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { BadgeModule } from 'primeng/badge';
import { CrudSequences } from '@avalantec/base-app/sequences';

@Component({
  selector: 'bifi-app-ticket-form',
  imports: [
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    HasPermission,
    SelectModule,
    TextareaModule,
    ProgressBarModule,
    LocaleDatePipe,
    TranslatePipe,
    DatePickerModule,
    ToggleSwitchModule,
    BadgeModule,
  ],
  templateUrl: './ticket-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsForm {
  protected formService = inject(TicketForm);
  private crudTickets = inject(CrudTickets);
  private crudStages = inject(CrudHelpdeskStages);
  private crudUsers = inject(CrudUsers);
  private crudTasks = inject(CrudTasks);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fileResolver = inject(FileResolver);
  private crudActivityHistories = inject(CrudActivityHistories);
  private translationService = inject(TranslationService);
  private crudSequences = inject(CrudSequences);

  id = input<string>('');

  ticketResource = this.crudTickets.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  private activityHistoryOrder = signal<orderByQuery<activityHistory>>([
    { field: 'performDate', order: 'desc' },
  ]);

  stagesResource = this.crudStages.get({});
  usersResource = this.crudUsers.get({});
  tasksResource = this.crudTasks.get({});
  activityHistoriesResource = this.crudActivityHistories.get({
    searchParams: computed(() => (this.id() ? { model: 'Ticket', modelId: this.id() } : undefined)),
    sort: this.activityHistoryOrder,
    triggerRequest: computed(() => !!this.id()),
    getInactive: null,
  });

  entry = this.ticketResource.value;
  stageOptions = this.stagesResource.value;
  userOptions = this.usersResource.value;
  allTasks = this.tasksResource.value;
  activityHistories = this.activityHistoriesResource.value;

  sequenceResource = this.crudSequences.get({
    searchParams: signal({ name: 'Tickets' }),
  });

  allTickets = this.crudTickets.get({});

  currentIndex = computed(() => {
    const list = this.allTickets.value() ?? [];
    const id = this.id();
    if (!id || list.length === 0) return -1;
    return list.findIndex(a => a._id === id);
  });

  totalTickets = computed(() => (this.allTickets.value() ?? []).length);

  prevTicketId = computed<string | null>(() => {
    const list = this.allTickets.value() ?? [];
    const idx = this.currentIndex();
    return idx > 0 ? (list[idx - 1]._id ?? null) : null;
  });

  nextTicketId = computed<string | null>(() => {
    const list = this.allTickets.value() ?? [];
    const idx = this.currentIndex();
    return idx >= 0 && idx < list.length - 1 ? (list[idx + 1]._id ?? null) : null;
  });

  previewNumber = computed(() => {
    const entry = this.entry();
    if (entry && entry.number) return entry.number;

    const seqs = this.sequenceResource.value();
    if (seqs && Array.isArray(seqs) && seqs.length > 0) {
      const seq = seqs[0] as any;
      const prefix = seq.prefix ?? '';
      const suffix = seq.suffix ?? '';
      const num = seq.number ?? 1;
      const size = seq.size ?? 5;
      const padded = num.toString().padStart(size, '0');
      return `${prefix}${padded}${suffix}`;
    }
    return 'TKT-XXXXX';
  });

  isLoading = computed(
    () =>
      this.ticketResource.isLoading() ||
      this.stagesResource.isLoading() ||
      this.usersResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.id());

  form = this.formService.form;

  linkedTaskIds = signal<string[]>([]);
  selectedUnit = signal('minutes'); // default

  availableTasks = computed(() => {
    const all = (this.allTasks() as any[]) ?? [];
    const linked = this.linkedTaskIds();
    return all.filter((t: any) => !linked.includes(t._id));
  });

  get followersArray() {
    return this.formService.followersArray;
  }

  priorityOptions = computed(() => [
    { label: this.translationService.translate('priority.low', {}, 'helpdesk'), value: 'low' },
    {
      label: this.translationService.translate('priority.medium', {}, 'helpdesk'),
      value: 'medium',
    },
    { label: this.translationService.translate('priority.high', {}, 'helpdesk'), value: 'high' },
    {
      label: this.translationService.translate('priority.urgent', {}, 'helpdesk'),
      value: 'urgent',
    },
  ]);

  typeOptions = computed(() => [
    {
      label: this.translationService.translate('type.helpdesk', {}, 'helpdesk'),
      value: 'helpdesk',
    },
    { label: this.translationService.translate('type.task', {}, 'helpdesk'), value: 'task' },
  ]);

  timeOptions = computed(() => [
    { label: this.translationService.translate('time.min', {}, 'helpdesk'), value: 'minutes' },
    { label: this.translationService.translate('time.hrs', {}, 'helpdesk'), value: 'hours' },
    { label: this.translationService.translate('time.days', {}, 'helpdesk'), value: 'days' },
  ]);

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (entry) {
        this.formService.patchValue({
          name: entry.name,
          description: entry.description ?? '',
          internalNotes: entry.internalNotes ?? '',
          priority: entry.priority,
          type: entry.type,
          stage: entry.stage?._id ?? '',
          assigned: entry.assigned?._id ?? '',
          senderUser: entry.senderUser?._id ?? '',
          followers: (entry.followers ?? []).map((f: any) => f._id ?? f),
          tagsInput: (entry.tags ?? []).join(', '),
          category: entry.category ?? '',
          appModule: entry.appModule ?? '',
          dateStart: entry.dateStart ? new Date(entry.dateStart) : undefined,
          dateEnd: entry.dateEnd ? new Date(entry.dateEnd) : undefined,
          dateScheduled: entry.dateScheduled ? new Date(entry.dateScheduled) : undefined,
          duration: entry.duration ?? '30',
          active: entry.active ?? true,
        });
        this.linkedTaskIds.set(entry.taskIds?.map(t => t._id) ?? []);
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.linkedTaskIds.set([]);

        this.form.patchValue({
          duration: '30',
        });

        this.selectedUnit.set('minutes');
      }
    });
  }

  addTask(taskId: string) {
    const current = this.linkedTaskIds();
    if (!current.includes(taskId)) {
      this.linkedTaskIds.set([...current, taskId]);
    }
  }

  removeTask(taskId: string) {
    this.linkedTaskIds.set(this.linkedTaskIds().filter(id => id !== taskId));
  }

  getTaskName(taskId: string): string {
    const task = (this.allTasks() as any[])?.find((t: any) => t._id === taskId);
    return task?.name ?? taskId;
  }

  addFollower(userId: string) {
    this.formService.addFollower(userId);
  }

  removeFollower(index: number) {
    this.formService.removeFollower(index);
  }

  getFollowerName(userId: string): string {
    const user = (this.userOptions() as any[])?.find((u: any) => u._id === userId);
    return user?.username ?? userId;
  }

  async handleSubmit(data: FormValueState<TicketFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const tags = rawValue.tagsInput
      ? rawValue.tagsInput
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const payload: Record<string, any> = {
      name: rawValue.name,
      priority: rawValue.priority,
      type: rawValue.type,
      taskIds: this.linkedTaskIds(),
      tags,
    };

    if (rawValue.description) payload['description'] = rawValue.description;
    if (rawValue.internalNotes) payload['internalNotes'] = rawValue.internalNotes;
    if (rawValue.stage) payload['stage'] = rawValue.stage;
    if (rawValue.assigned) payload['assigned'] = rawValue.assigned;
    if (rawValue.senderUser) payload['senderUser'] = rawValue.senderUser;
    if (rawValue.followers?.length) payload['followers'] = rawValue.followers;
    if (rawValue.category) payload['category'] = rawValue.category;
    if (rawValue.appModule) payload['appModule'] = rawValue.appModule;
    if (rawValue.duration) payload['duration'] = rawValue.duration;
    payload['active'] = rawValue.active ?? true;

    payload['dateStart'] = rawValue.dateStart
      ? new Date(rawValue.dateStart).toISOString()
      : new Date().toISOString();

    // * If dateEnd is provided, set it and also calculate slaResolutionDeadline as 3 days after dateEnd
    if (rawValue.dateEnd) {
      payload['dateEnd'] = new Date(rawValue.dateEnd).toISOString();
      // Calcular automáticamente slaResolutionDeadline como 3 días después de dateEnd
      const dateEnd = new Date(rawValue.dateEnd);
      const slaDeadline = new Date(dateEnd);
      slaDeadline.setDate(slaDeadline.getDate() + 3);
      payload['slaResolutionDeadline'] = slaDeadline.toISOString();
    }

    // * If dateScheduled is provided, set it and also calculate slaResponseDeadline as 3 days before dateScheduled
    if (rawValue.dateScheduled) {
      payload['dateScheduled'] = new Date(rawValue.dateScheduled).toISOString();
      // Calcular automáticamente slaResponseDeadline como 3 días antes de dateScheduled
      const dateScheduled = new Date(rawValue.dateScheduled);
      const slaDeadline = new Date(dateScheduled);
      slaDeadline.setDate(slaDeadline.getDate() - 3);
      payload['slaResponseDeadline'] = slaDeadline.toISOString();
    }

    //     const durationFull = rawValue.duration
    //   ? `${rawValue.duration} ${this.selectedUnit()}`
    //   : '';
    // payload['duration'] = durationFull;

    const action = this.isUpdate()
      ? this.crudTickets.put({ _id: this.id() || '', data: payload as ticket })
      : this.crudTickets.post({ data: payload as ticket });

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

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }

  downloadAttachment(attachment: ticketAttachment) {
    this.fileResolver.downloadFileInBrowser({ id: attachment.fileId }, 'download');
  }

  activityFieldLabel(field: string): string {
    return this.translationService.translate('activityField.' + field, {}, 'helpdesk');
  }

  handleNavigatePrevTicket() {
    const id = this.prevTicketId();
    if (!id) return;
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  handleNavigateNextTicket() {
    const id = this.nextTicketId();
    if (!id) return;
    this.router.navigate(['../', id], { relativeTo: this.route });
  }
}
