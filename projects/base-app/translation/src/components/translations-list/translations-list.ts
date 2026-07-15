import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { CrudTranslations } from '../../services/crud-translations';
import { translationColumns } from '../../libraries/translation-columns';
import { translationFilters } from '../../libraries/translation-filters';
import { translationRecord } from '../../interfaces/translation';

/**
 * List view for Translation records.
 * Supports infinite scroll, search filtering, and row-level delete/edit actions.
 */
@Component({
  selector: 'bifi-app-translations-list',
  providers: [provideResourceManager(CrudTranslations)],
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
  templateUrl: './translations-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationsList {
  private resourceManager = inject<ResourceManager<translationRecord>>(ResourceManager);
  private crudTranslations = inject(CrudTranslations);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  translationColumns = translationColumns;
  translationFilters = translationFilters;
  translations = this.resourceManager.data;

  /**
   * Navigate to the edit form for a translation row.
   * @param element - The translation record to edit
   */
  goToEdit = (element: translationRecord) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /**
   * Deletes a translation record by ID and reloads the list.
   * @param id - The record ID to delete
   */
  deleteTranslation(id: string) {
    this.crudTranslations.delete({ _id: id }).subscribe({
      next: () => this.translations.reload(),
    });
  }

  exportCsv() {
    this.crudTranslations.exportCSV();
  }
}
