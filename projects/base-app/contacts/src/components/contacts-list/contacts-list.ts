import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CrudContacts } from '../../services/crud-contacts';
import { contactColumns } from '../../libraries/contact-columns';
import { contactFilters } from '../../libraries/contact-filters';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { contact } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-contacts-list',
  providers: [provideResourceManager(CrudContacts)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, SearchBar, HasPermission, RouterLink],
  templateUrl: './contacts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsList {
  private resourceManager = inject<ResourceManager<contact>>(ResourceManager);
  private crudContacts = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);

  contactColumns = contactColumns;
  contactFilters = contactFilters;

  contacts = this.resourceManager.data;

  deleteContact(id: string) {
    this.crudContacts
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.contacts.reload();
        },
      });
  }
}
