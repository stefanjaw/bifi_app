import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { TranslatePipe, languageRecord } from '@avalantec/base-app/i18n';
import { CrudLanguages } from '../../services/crud-languages';
import { languageColumns } from '../../libraries/language-columns';
import { languageFilters } from '../../libraries/language-filters';

/**
 * List view for Language records.
 * Supports infinite scroll, search filtering, and row-level delete/edit actions.
 */
@Component({
  selector: 'bifi-app-languages-list',
  providers: [provideResourceManager(CrudLanguages)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './languages-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesList {
  private resourceManager = inject<ResourceManager<languageRecord>>(ResourceManager);
  private crudLanguages = inject(CrudLanguages);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  languageColumns = languageColumns;
  languageFilters = languageFilters;
  languages = this.resourceManager.data;
  isImporting = signal(false);

  /**
   * Navigate to the edit form for a language row.
   * @param element - The language record to edit
   */
  goToEdit = (element: languageRecord) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /**
   * Deletes a language record by ID and reloads the list.
   * @param id - The record ID to delete
   */
  deleteLanguage(id: string) {
    this.crudLanguages.delete({ _id: id }).subscribe({
      next: () => this.languages.reload(),
    });
  }

  downloadCsv() {
    this.crudLanguages.exportCSV();
  }

  /**
   * Uploads the selected CSV to POST /languages/import.
   * Existing locales are updated, missing ones are created, and duplicated
   * rows within the file collapse (last one wins) — the backend import is an
   * upsert, so the upload never crashes on existing locales.
   * @param event - The file input change event carrying the selected CSV.
   */
  importCsv(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    // Reset the input so picking the same file again still fires change.
    input.value = '';

    if (!file) return;

    this.isImporting.set(true);

    this.crudLanguages
      .post({ data: { csv: file }, specificEndpoint: 'import' })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isImporting.set(false);
          this.languages.reload();
        },
        error: () => {
          this.isImporting.set(false);
        },
      });
  }
}
