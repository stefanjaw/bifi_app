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
import { TicketForm as TicketFormService, TicketFormModel } from '../../services/ticket-form';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { CrudUsers } from '@avalantec/base-app/users';
import { CrudTasks } from '@avalantec/tasks';
import { ticket } from '../../interfaces/ticket';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'bifi-app-ticket-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    SelectModule,
    TextareaModule,
    ProgressBarModule,
    DatePipe,
    JsonPipe,
  ],
  templateUrl: './ticket-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFormComponent {
  protected formService = inject(TicketFormService);
  private crudTickets = inject(CrudTickets);
  private crudStages = inject(CrudHelpdeskStages);
  private crudUsers = inject(CrudUsers);
  private crudTasks = inject(CrudTasks);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  ticketResource = this.crudTickets.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  stagesResource = this.crudStages.get({});
  usersResource = this.crudUsers.get({});
  tasksResource = this.crudTasks.get({});

  entry = this.ticketResource.value;
  stageOptions = this.stagesResource.value;
  userOptions = this.usersResource.value;
  allTasks = this.tasksResource.value;

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

  availableTasks = computed(() => {
    const all = (this.allTasks() as any[]) ?? [];
    const linked = this.linkedTaskIds();
    return all.filter((t: any) => !linked.includes(t._id));
  });

  get followersArray() {
    return this.formService.followersArray;
  }

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  typeOptions = [
    { label: 'Helpdesk', value: 'helpdesk' },
    { label: 'Task', value: 'task' },
  ];

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
        });
        this.linkedTaskIds.set(entry.taskIds ?? []);
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.linkedTaskIds.set([]);
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
      ? rawValue.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)
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

  activityFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Subject',
      description: 'Description',
      internalNotes: 'Internal Notes',
      priority: 'Priority',
      type: 'Type',
      stage: 'Stage',
      assigned: 'Assigned',
      followers: 'Followers',
      tags: 'Tags',
      taskIds: 'Linked Tasks',
      category: 'Category',
      appModule: 'Module',
      active: 'Active',
    };
    return labels[field] ?? field;
  }
}
