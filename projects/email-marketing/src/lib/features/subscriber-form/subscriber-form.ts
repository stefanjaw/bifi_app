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
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudSubscribers } from '../../services/crud-subscribers';
import { CrudMailingLists } from '../../services/crud-mailing-lists';
import { SubscriberForm, SubscriberFormModel } from '../../services/subscriber-form';
import { subscriber } from '../../interfaces/subscriber';
import { mailingList } from '../../interfaces/mailing-list';

@Component({
  selector: 'bifi-app-subscriber-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './subscriber-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribersForm {
  private crudSubscribers = inject(CrudSubscribers);
  private crudLists = inject(CrudMailingLists);
  private formService = inject(SubscriberForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  subscriberResource = this.crudSubscribers.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  private listsResource = this.crudLists.get({
    id: signal(''),
    getInactive: signal(false),
  });

  listOptions = computed<mailingList[]>(() => {
    const data = this.listsResource.value();
    return Array.isArray(data) ? data : [];
  });

  statusOptions = [
    { label: 'Subscribed', value: 'subscribed' },
    { label: 'Unsubscribed', value: 'unsubscribed' },
    { label: 'Bounced', value: 'bounced' },
    { label: 'Complained', value: 'complained' },
  ];

  form = this.formService.form;

  subscriber = this.subscriberResource.value;
  isUpdate = computed(() => !!this.subscriber());
  loading = this.subscriberResource.isLoading;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const sub = this.subscriber();
      if (sub) {
        this.formService.patchValue({
          email: sub.email,
          name: sub.name ?? '',
          listId: this.resolveId(sub.listId),
          status: sub.status,
          tagsInput: (sub.tags ?? []).join(', '),
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  private resolveId(value: string | mailingList | undefined): string {
    if (!value) return '';
    return typeof value === 'object' ? value._id : value;
  }

  handleSubmit(values: FormValueState<SubscriberFormModel>) {
    this.isSubmitLoading.set(true);
    const raw = values.rawValue;
    const tags = (raw.tagsInput ?? '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      email: raw.email,
      name: raw.name,
      listId: raw.listId,
      status: raw.status,
      tags,
    };

    const action = this.isUpdate()
      ? this.crudSubscribers.put({ _id: this.id(), data: payload })
      : this.crudSubscribers.post({ data: payload });

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
