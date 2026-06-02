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
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudMailingLists } from '../../services/crud-mailing-lists';
import { MailingListForm, MailingListFormModel } from '../../services/mailing-list-form';

@Component({
  selector: 'bifi-app-mailing-list-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './mailing-list-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailingListFormComponent {
  private crudLists = inject(CrudMailingLists);
  private formService = inject(MailingListForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  listResource = this.crudLists.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  form = this.formService.form;

  list = this.listResource.value;
  isUpdate = computed(() => !!this.list());
  loading = this.listResource.isLoading;
  isSubmitLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const list = this.list();
      if (list) {
        this.formService.patchValue({
          name: list.name,
          description: list.description ?? '',
        });
        this.formService.resetDirtyState();
      } else {
        this.formService.reset();
      }
    });
  }

  handleSubmit(values: FormValueState<MailingListFormModel>) {
    this.isSubmitLoading.set(true);
    const action = this.isUpdate()
      ? this.crudLists.put({ _id: this.id(), data: values.rawValue })
      : this.crudLists.post({ data: values.rawValue });

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
