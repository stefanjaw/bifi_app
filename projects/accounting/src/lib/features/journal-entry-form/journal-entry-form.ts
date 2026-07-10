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
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { CrudJournalEntries } from '../../services/crud-journal-entries';
import { CrudJournals } from '../../services/crud-journals';
import { CrudAccounts } from '../../services/crud-accounts';
import { CrudCurrencies } from '@avalantec/base-app/currency';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { JournalEntryFormService, JournalEntryFormModel } from '../../services/journal-entry-form';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-journal-entry-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    SelectModule,
    ProgressBarModule,
    InputNumberModule,
    ButtonModule,
    DatePickerModule,
    DecimalPipe,
    TranslatePipe,
  ],
  templateUrl: './journal-entry-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalEntryForm {
  private formService = inject(JournalEntryFormService);
  private crudJournalEntries = inject(CrudJournalEntries);
  private crudJournals = inject(CrudJournals);
  private crudAccounts = inject(CrudAccounts);
  private crudCurrencies = inject(CrudCurrencies);
  private router = inject(Router);
  private destroy$ = inject(DestroyRef);
  private translationService = inject(TranslationService);

  id = input<string>('');

  entryResource = this.crudJournalEntries.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });
  journalsResource = this.crudJournals.get({});
  accountsResource = this.crudAccounts.get({});
  currenciesResource = this.crudCurrencies.get({});

  isUpdate = computed(() => !!this.id());
  isLoading = computed(
    () =>
      this.entryResource.isLoading() ||
      this.journalsResource.isLoading() ||
      this.accountsResource.isLoading() ||
      this.currenciesResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isPostLoading = signal(false);

  entryStatus = computed(() => this.entryResource.value()?.status ?? 'draft');
  canPost = computed(() => this.isUpdate() && this.entryStatus() === 'draft');

  form = this.formService.form;
  journals = this.journalsResource.value;
  accounts = this.accountsResource.value;
  currencies = this.currenciesResource.value;

  get lines(): FormGroup[] {
    return this.formService.lines;
  }

  private linesValue = toSignal(this.formService.linesArray.valueChanges, {
    initialValue: this.formService.linesArray.value,
  });

  totalDebit = computed(() =>
    this.linesValue().reduce((s: number, l: any) => s + (l.debit ?? 0), 0)
  );

  totalCredit = computed(() =>
    this.linesValue().reduce((s: number, l: any) => s + (l.credit ?? 0), 0)
  );

  addLine() {
    this.formService.addLine();
  }

  removeLine(index: number) {
    this.formService.removeLine(index);
  }

  constructor() {
    effect(() => {
      const entry = this.entryResource.value();
      if (entry) {
        this.formService.patchValue({
          journalId: entry.journalId?._id ?? '',
          date: entry.date ? new Date(entry.date) : null,
          reference: entry.reference ?? '',
          currencyId: entry.currencyId?._id ?? '',
          lines: (entry.lines ?? []).map((line: any) => ({
            accountId: line.accountId?._id ?? '',
            description: line.description ?? '',
            debit: line.debit ?? 0,
            credit: line.credit ?? 0,
          })),
        });
        this.formService.resetDirtyState();
      } else if (!this.isUpdate()) {
        this.formService.reset();
        this.formService.addLine();
        this.formService.addLine();
      }
    });
  }

  handleSubmit(data: FormValueState<JournalEntryFormModel>) {
    const { rawValue } = data;
    const lines = rawValue.lines ?? [];
    const totalDebit = lines.reduce((s: number, l: any) => s + (l.debit ?? 0), 0);
    const totalCredit = lines.reduce((s: number, l: any) => s + (l.credit ?? 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.0001) {
      alert(this.translationService.translate('validation.debitsEqualCredits', {}, 'accounting'));
      return;
    }
    if (lines.length < 2) {
      alert(this.translationService.translate('validation.minLinesRequired', {}, 'accounting'));
      return;
    }

    this.isSubmitLoading.set(true);
    const payload = {
      ...rawValue,
      date: rawValue.date instanceof Date ? rawValue.date.toISOString() : rawValue.date,
    };
    const action = this.isUpdate()
      ? this.crudJournalEntries.put({ _id: this.id(), data: payload as any })
      : this.crudJournalEntries.post({ data: payload as any });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  postEntry() {
    this.isPostLoading.set(true);
    this.crudJournalEntries
      .postEntry(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isPostLoading.set(false);
          this.goBack();
        },
        error: () => this.isPostLoading.set(false),
      });
  }

  goBack() {
    this.router.navigate(['/accounting/journal-entries']);
  }
}
