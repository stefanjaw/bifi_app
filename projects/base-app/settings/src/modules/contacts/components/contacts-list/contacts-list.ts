import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CrudContacts } from '../../services/crud-contacts';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { contact } from '../../interfaces/contacts';
import { contactColumns } from '../../libraries/contact-columns';
import { contactFilters } from '../../libraries/contact-filters';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';

@Component({
  selector: 'bifi-app-contacts-list',
  providers: [provideResourceManager(CrudContacts)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, MatMenuItem, MatIcon, SearchBar],
  templateUrl: './contacts-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsList {
  private resourceManager = inject<ResourceManager<contact>>(ResourceManager);

  contactColumns = contactColumns;
  contactFilters = contactFilters;

  contacts = this.resourceManager.data;
}
