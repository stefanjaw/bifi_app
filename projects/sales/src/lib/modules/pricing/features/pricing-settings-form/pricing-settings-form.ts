import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudPricingSettings } from '../../services/crud-pricing-settings';
import {
  PricingSettingsForm,
  PricingSettingsFormModel,
  FolderRowModel,
} from '../../services/pricing-settings-form';
import { pricingSettings, PricingFolder, IndexingStatus } from '../../interfaces/pricing-settings';
import { CrudSequences, sequence } from '@avalantec/base-app/sequences';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bifi-app-pricing-settings-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    DatePipe,
  ],
  templateUrl: './pricing-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingSettingsPage implements OnDestroy {
  private crudSettings = inject(CrudPricingSettings);
  private formService = inject(PricingSettingsForm);
  private crudSequences = inject(CrudSequences);
  private destroy$ = inject(DestroyRef);
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected isIndexingLoading = signal(false);

  protected settingsResource = this.crudSettings.getSettings();

  protected sequencesResource = this.crudSequences.get({
    id: signal(''),
    getInactive: signal(false),
  });

  protected sequenceOptions = computed<sequence[]>(() => {
    const data = this.sequencesResource.value();
    return Array.isArray(data) ? data : [];
  });

  protected loading = computed(
    () => this.settingsResource.isLoading() && !this.settingsResource.error()
  );

  protected pricingMethodOptions = [
    { label: 'Markup', value: 'markup' },
    { label: 'Margin', value: 'margin' },
  ];

  protected shippingMethodOptions = [
    { label: 'Sea', value: 'sea' },
    { label: 'Air', value: 'air' },
    { label: 'Land', value: 'land' },
  ];

  protected folderTypeOptions = [
    { label: 'Pricing', value: 'pricing' },
    { label: 'Freight', value: 'freight' },
    { label: 'Config', value: 'config' },
  ];

  protected folders = signal<FolderRowModel[]>([]);
  protected indexingStatus = signal<IndexingStatus | null>(null);
  protected indexingMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as pricingSettings;

      this.formService.patchValue({
        estimateSequence: this.resolveId(settings.estimateSequence),
        defaultWharfageBankFeePct: String(settings.defaultWharfageBankFeePct ?? 2),
        defaultShippingMethod: settings.defaultShippingMethod ?? 'sea',
        defaultPricingMethod: settings.defaultPricingMethod ?? 'markup',
        defaultMarkupFactor: String(settings.defaultMarkupFactor ?? 1.3),
        defaultMargin: String(settings.defaultMargin ?? 30),
      });

      if (settings.folders && settings.folders.length > 0) {
        this.folders.set(
          settings.folders.map((f: PricingFolder) => ({
            type: f.type,
            folderId: f.folderId,
            label: f.label || '',
          }))
        );
      }
    });

    this.loadIndexingStatus();
    this.checkIfAlreadyRunning();
  }

  private checkIfAlreadyRunning() {
    this.crudSettings
      .getIndexingStatus()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: status => {
          if (status.isRunning) {
            this.isIndexingLoading.set(true);
            this.indexingMessage.set('Indexing in progress…');
            this.startPolling();
          }
        },
        error: () => {},
      });
  }

  private resolveId(value: sequence | string | undefined): string {
    if (!value) return '';
    if (typeof value === 'object') return (value as sequence)._id;
    return value;
  }

  protected addFolder() {
    this.folders.update(rows => [...rows, { type: 'pricing' as const, folderId: '', label: '' }]);
  }

  protected removeFolder(index: number) {
    this.folders.update(rows => rows.filter((_, i) => i !== index));
  }

  protected updateFolderType(index: number, value: 'pricing' | 'freight' | 'config') {
    this.folders.update(rows => rows.map((r, i) => (i === index ? { ...r, type: value } : r)));
  }

  protected updateFolderId(index: number, value: string) {
    this.folders.update(rows => rows.map((r, i) => (i === index ? { ...r, folderId: value } : r)));
  }

  protected updateFolderLabel(index: number, value: string) {
    this.folders.update(rows => rows.map((r, i) => (i === index ? { ...r, label: value } : r)));
  }

  private loadIndexingStatus() {
    this.crudSettings
      .getIndexingStatus()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: status => this.indexingStatus.set(status),
        error: () => {},
      });
  }

  protected triggerIndex(type?: 'pricing' | 'freight' | 'all', force?: boolean) {
    this.isIndexingLoading.set(true);
    this.indexingMessage.set(
      force
        ? 'Full reindex started — processing all files from scratch…'
        : 'Indexing started — processing files in background…'
    );

    this.crudSettings
      .triggerIndexing(type, force)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.startPolling();
        },
        error: err => {
          this.isIndexingLoading.set(false);
          this.indexingMessage.set(err?.error?.message || 'Indexing failed.');
        },
      });
  }

  private startPolling() {
    this.stopPolling();
    this.pollingInterval = setInterval(() => {
      this.crudSettings
        .getIndexingStatus()
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe({
          next: status => {
            this.indexingStatus.set(status);
            if (!status.isRunning) {
              this.stopPolling();
              this.isIndexingLoading.set(false);
              if (status.lastResult) {
                const r = status.lastResult;
                const msg = `Indexed ${r.filesProcessed} files: ${r.catalogRecords} catalog, ${r.freightRecords} freight records.${r.errors.length > 0 ? ` ${r.errors.length} error(s): ${r.errors.join('; ')}` : ''}`;
                this.indexingMessage.set(msg);
              } else {
                this.indexingMessage.set('Indexing complete.');
              }
            }
          },
          error: () => {},
        });
    }, 4000);
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  protected handleSubmit(state: FormValueState<PricingSettingsFormModel>) {
    this.isSubmitLoading.set(true);

    const rawValue = state.rawValue;
    const payload: Record<string, unknown> = {};

    if (rawValue.estimateSequence) payload['estimateSequence'] = rawValue.estimateSequence;
    if (rawValue.defaultWharfageBankFeePct)
      payload['defaultWharfageBankFeePct'] = Number(rawValue.defaultWharfageBankFeePct);
    if (rawValue.defaultShippingMethod)
      payload['defaultShippingMethod'] = rawValue.defaultShippingMethod;
    if (rawValue.defaultPricingMethod)
      payload['defaultPricingMethod'] = rawValue.defaultPricingMethod;
    if (rawValue.defaultMarkupFactor)
      payload['defaultMarkupFactor'] = Number(rawValue.defaultMarkupFactor);
    if (rawValue.defaultMargin) payload['defaultMargin'] = Number(rawValue.defaultMargin);

    const validFolders = this.folders().filter(f => f.folderId.trim());
    payload['folders'] = validFolders.map(f => ({
      type: f.type,
      folderId: f.folderId.trim(),
      label: f.label?.trim() || undefined,
    }));

    this.crudSettings
      .putSettings(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.settingsResource.reload();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
