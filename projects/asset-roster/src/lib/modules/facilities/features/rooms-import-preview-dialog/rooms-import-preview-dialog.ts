import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseDialog } from '@avalantec/base-app/core';
import { t, TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudRooms } from '../../services/crud-rooms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

type CsvRow = Record<string, string>;

interface ImportValidationResult {
  valid: boolean;
  rowCount: number;
}

/**
 * Preview dialog for the Room CSV import: lets the user pick which CSV columns
 * to import, previews the first records, validates the selection with the
 * backend, and finally runs the import.
 */
@Component({
  selector: 'bifi-app-rooms-import-preview-dialog',
  imports: [DialogModule, ButtonModule, TranslatePipe],
  templateUrl: './rooms-import-preview-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsImportPreviewDialog extends BaseDialog {
  private crudRooms = inject(CrudRooms);
  private destroy$ = inject(DestroyRef);

  /** Emits after a successful import so the parent can reload its data. */
  imported = output<void>();

  fileName = signal('');
  columns = signal<string[]>([]);
  selectedColumns = signal<string[]>([]);
  rows = signal<CsvRow[]>([]);
  parseError = signal<string | null>(null);

  validationMessage = signal<string | null>(null);
  validationPassed = signal(false);
  validating = signal(false);
  importing = signal(false);

  /**
   * Opens the dialog and asynchronously parses the given CSV file.
   * @param file - The CSV file selected by the user.
   */
  open(file: File): void {
    this.resetState();
    this.fileName.set(file.name);
    this.openDialog();

    void this.readCsvFile(file);
  }

  /** Closes the dialog and clears the parsed state. */
  closeImportDialog(): void {
    this.closeDialog();
    this.resetState();
  }

  /** Selects every importable column. */
  selectAllColumns(): void {
    this.selectedColumns.set([...this.columns()]);
    this.resetValidation();
  }

  /** Clears the selected columns. */
  clearSelectedColumns(): void {
    this.selectedColumns.set([]);
    this.resetValidation();
  }

  /**
   * Adds or removes a column from the selection.
   * @param column - The column name to toggle.
   * @param event - The originating checkbox change event.
   */
  toggleColumn(column: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedColumns.update(columns =>
      checked ? [...columns, column] : columns.filter(c => c !== column)
    );

    this.resetValidation();
  }

  /** Sends the selected columns as CSV to the backend import/validate endpoint. */
  validateImport(): void {
    const csv = this.createSelectedColumnsCsv();

    if (!csv) {
      this.validationMessage.set(t('import.selectColumnRequired', {}, 'asset-roster'));
      return;
    }

    this.validating.set(true);
    this.resetValidation();

    this.crudRooms
      .post<ImportValidationResult>({
        data: { csv },
        specificEndpoint: 'import/validate',
        notificationConfig: { enable: false },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: validationResult => {
          if (!validationResult) {
            this.validationPassed.set(false);
            this.validationMessage.set(t('import.validationFailed', {}, 'asset-roster'));
            this.validating.set(false);
            return;
          }

          this.validationPassed.set(true);
          this.validationMessage.set(
            t('import.rowsPassed', { count: validationResult.rowCount }, 'asset-roster')
          );
          this.validating.set(false);
        },
        error: error => {
          this.validationPassed.set(false);
          this.validationMessage.set(this.getValidationErrorMessage(error));
          this.validating.set(false);
        },
      });
  }

  /** Runs the import with the validated, selected columns. */
  import(): void {
    const csv = this.createSelectedColumnsCsv();

    if (!csv || !this.validationPassed()) {
      return;
    }

    this.importing.set(true);

    this.crudRooms
      .post({
        data: { csv },
        specificEndpoint: 'import',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.importing.set(false);
          this.imported.emit();
          this.closeImportDialog();
        },
        error: () => {
          this.importing.set(false);
        },
      });
  }

  /**
   * Reads the file, validates the header row, and populates columns and rows.
   * @param file - The CSV file to parse.
   */
  private async readCsvFile(file: File): Promise<void> {
    try {
      const parsedRows = this.parseCsv(await file.text());

      if (parsedRows.length < 2) {
        throw new Error(t('import.headerRowRequired', {}, 'asset-roster'));
      }

      const [headerRow, ...dataRows] = parsedRows;

      const columns = headerRow.map((column, index) =>
        index === 0 ? column.replace(/^\uFEFF/, '').trim() : column.trim()
      );

      if (columns.some(column => !column)) {
        throw new Error(t('import.emptyColumn', {}, 'asset-roster'));
      }

      if (new Set(columns).size !== columns.length) {
        throw new Error(t('import.duplicateColumn', {}, 'asset-roster'));
      }

      const selectableColumns = columns.filter(column => column !== '_id' && column !== '__v');

      if (selectableColumns.length === 0) {
        throw new Error(t('import.noImportableColumns', {}, 'asset-roster'));
      }

      this.columns.set(selectableColumns);
      this.selectedColumns.set([...selectableColumns]);
      this.rows.set(
        dataRows
          .filter(row => row.some(value => value.trim() !== ''))
          .map(row =>
            Object.fromEntries(columns.map((column, index) => [column, row[index] ?? '']))
          )
      );
    } catch (error) {
      this.parseError.set(
        error instanceof Error ? error.message : t('import.unreadableFile', {}, 'asset-roster')
      );
    }
  }

  /**
   * Rebuilds a CSV File from the currently selected columns and parsed rows.
   * @returns A CSV File ready to send, or null when nothing is selected/has rows.
   */
  private createSelectedColumnsCsv(): File | null {
    const selectedColumns = this.selectedColumns();

    if (selectedColumns.length === 0 || this.rows().length === 0) {
      return null;
    }

    const csvContent = [
      selectedColumns.map(column => this.escapeCsvValue(column)).join(','),
      ...this.rows().map(row =>
        selectedColumns.map(column => this.escapeCsvValue(row[column] ?? '')).join(',')
      ),
    ].join('\r\n');

    return new File([csvContent], this.fileName() || 'rooms-import.csv', {
      type: 'text/csv',
    });
  }

  /**
   * Parses CSV text into an array of rows of cells, honoring quoted values.
   * @param text - The raw CSV content.
   * @returns The parsed rows.
   */
  private parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let value = '';
    let insideQuotes = false;

    for (let index = 0; index < text.length; index++) {
      const character = text[index];

      if (character === '"') {
        if (insideQuotes && text[index + 1] === '"') {
          value += '"';
          index++;
        } else {
          insideQuotes = !insideQuotes;
        }
        continue;
      }

      if (character === ',' && !insideQuotes) {
        row.push(value);
        value = '';
        continue;
      }

      if ((character === '\n' || character === '\r') && !insideQuotes) {
        if (character === '\r' && text[index + 1] === '\n') {
          index++;
        }

        row.push(value);

        if (row.some(cell => cell.trim() !== '')) {
          rows.push(row);
        }

        row = [];
        value = '';
        continue;
      }

      value += character;
    }

    if (insideQuotes) {
      throw new Error(t('import.unclosedQuote', {}, 'asset-roster'));
    }

    row.push(value);

    if (row.some(cell => cell.trim() !== '')) {
      rows.push(row);
    }

    return rows;
  }

  /**
   * Quotes and escapes a single CSV value.
   * @param value - The raw value to escape.
   * @returns The escaped CSV-safe value.
   */
  private escapeCsvValue(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }

  /** Clears the previous validation result. */
  private resetValidation(): void {
    this.validationPassed.set(false);
    this.validationMessage.set(null);
  }

  /** Resets every piece of dialog state to its initial values. */
  private resetState(): void {
    this.fileName.set('');
    this.columns.set([]);
    this.selectedColumns.set([]);
    this.rows.set([]);
    this.parseError.set(null);
    this.validationMessage.set(null);
    this.validationPassed.set(false);
    this.validating.set(false);
    this.importing.set(false);
  }

  /**
   * Normalizes a backend validation error into a human-readable message.
   * @param error - The raw error from the HTTP layer.
   * @returns A readable error message.
   */
  private getValidationErrorMessage(error: unknown): string {
    const response = error as {
      message?: unknown;
      error?: {
        message?: unknown;
        errors?: unknown;
        details?: unknown;
      };
    };

    const details = response.error?.errors ?? response.error?.details;

    if (Array.isArray(details) && details.length > 0) {
      const messages = details
        .map((detail: { path?: string; messages?: string | string[] }) => {
          const fieldMessage = Array.isArray(detail.messages)
            ? detail.messages.join(', ')
            : (detail.messages ?? t('import.invalidValue', {}, 'asset-roster'));

          return detail.path ? `${detail.path}: ${fieldMessage}` : fieldMessage;
        })
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join('\n');
      }
    }

    if (typeof response.message === 'string' && response.message.trim()) {
      return response.message;
    }

    if (typeof response.error?.message === 'string' && response.error.message.trim()) {
      return response.error.message;
    }

    return t('import.validationFailed', {}, 'asset-roster');
  }
}
