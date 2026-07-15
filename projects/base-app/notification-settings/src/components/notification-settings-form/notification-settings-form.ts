import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { CrudNotificationSettings } from '../../services/crud-notification-settings';
import {
  NotificationEventConfig,
  NotificationCatalogEntry,
  RecipientOption,
} from '../../interfaces/notification-settings';

interface ActiveEventRow {
  type: string;
  enabled: boolean;
  recipients: string[];
  label: string;
  description: string;
  icon: string;
  iconBg: string;
  recipientOptions: RecipientOption[];
}

@Component({
  selector: 'bifi-app-notification-settings-form',
  imports: [
    NgClass,
    FormsModule,
    FormModule,
    TranslatePipe,
    ButtonModule,
    ToggleSwitchModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    MultiSelectModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './notification-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettingsForm {
  private crudSettings = inject(CrudNotificationSettings);
  private messageService = inject(MessageService);
  private translationService = inject(TranslationService);

  protected saving = signal(false);
  protected settingsResource = this.crudSettings.getSettings();
  protected catalogResource = this.crudSettings.getCatalog();

  protected loading = computed(
    () =>
      (this.settingsResource.isLoading() || this.catalogResource.isLoading()) &&
      !this.settingsResource.error() &&
      !this.catalogResource.error()
  );

  protected activeEvents = signal<ActiveEventRow[]>([]);

  protected showAddDialog = signal(false);

  protected availableCatalogEntries = computed<NotificationCatalogEntry[]>(() => {
    const catalog = this.catalogResource.value() ?? [];
    const active = this.activeEvents();
    const activeTypes = new Set(active.map(e => e.type));
    return catalog.filter(c => !activeTypes.has(c.type));
  });

  protected selectedNewEventType = signal<string | null>(null);

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      const catalog = this.catalogResource.value();
      if (!raw || !catalog || catalog.length === 0) return;

      const apiEvents: NotificationEventConfig[] = raw.events ?? [];
      const rows: ActiveEventRow[] = apiEvents
        .map(saved => {
          const meta = catalog.find(c => c.type === saved.type);
          if (!meta) return null;
          return {
            type: saved.type,
            enabled: saved.enabled,
            recipients: saved.recipients?.length ? saved.recipients : [...meta.defaultRecipients],
            label: meta.label,
            description: meta.description,
            icon: meta.icon,
            iconBg: meta.iconBg,
            recipientOptions: meta.recipientOptions,
          } as ActiveEventRow;
        })
        .filter((r): r is ActiveEventRow => r !== null);

      if (rows.length === 0) {
        const defaults: ActiveEventRow[] = catalog.map(meta => ({
          type: meta.type,
          enabled: true,
          recipients: [...meta.defaultRecipients],
          label: meta.label,
          description: meta.description,
          icon: meta.icon,
          iconBg: meta.iconBg,
          recipientOptions: meta.recipientOptions,
        }));
        this.activeEvents.set(defaults);
      } else {
        this.activeEvents.set(rows);
      }
    });
  }

  protected toggleEvent(type: string, enabled: boolean): void {
    this.activeEvents.update(rows => rows.map(r => (r.type === type ? { ...r, enabled } : r)));
  }

  protected updateRecipients(type: string, recipients: string[]): void {
    this.activeEvents.update(rows => rows.map(r => (r.type === type ? { ...r, recipients } : r)));
  }

  protected removeEvent(type: string): void {
    this.activeEvents.update(rows => rows.filter(r => r.type !== type));
  }

  protected openAddDialog(): void {
    this.selectedNewEventType.set(null);
    this.showAddDialog.set(true);
  }

  protected confirmAddEvent(): void {
    const type = this.selectedNewEventType();
    if (!type) return;
    const catalog = this.catalogResource.value() ?? [];
    const meta = catalog.find(c => c.type === type);
    if (!meta) return;
    const newRow: ActiveEventRow = {
      type: meta.type,
      enabled: true,
      recipients: [...meta.defaultRecipients],
      label: meta.label,
      description: meta.description,
      icon: meta.icon,
      iconBg: meta.iconBg,
      recipientOptions: meta.recipientOptions,
    };
    this.activeEvents.update(rows => [...rows, newRow]);
    this.showAddDialog.set(false);
  }

  protected recipientLabels(row: ActiveEventRow): string {
    if (!row.recipients?.length) return 'No recipients';
    return row.recipients
      .map(id => row.recipientOptions.find(o => o.id === id)?.label ?? id)
      .join(', ');
  }

  protected save(): void {
    this.saving.set(true);
    const payload = {
      events: this.activeEvents().map(r => ({
        type: r.type,
        enabled: r.enabled,
        recipients: r.recipients,
      })),
    };
    this.crudSettings.putSettings(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.translationService.translate(
            'toast.saved',
            {},
            'base-app/notification-settings'
          ),
          detail: this.translationService.translate(
            'toast.savedDetail',
            {},
            'base-app/notification-settings'
          ),
        });
      },
      error: () => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translationService.translate(
            'toast.error',
            {},
            'base-app/notification-settings'
          ),
          detail: this.translationService.translate(
            'toast.errorDetail',
            {},
            'base-app/notification-settings'
          ),
        });
      },
    });
  }
}
