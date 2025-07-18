import { Injectable, signal } from '@angular/core';
import { BaseMenuManager } from '../../system';

@Injectable({
  providedIn: 'root',
})
export class SettingsMenuManager extends BaseMenuManager {
  constructor() {
    const menuItems = signal([
      {
        iconName: 'people',
        route: '/settings/contacts',
        title: 'Contacts',
      },
      {
        iconName: 'other_houses',
        route: '/settings/companies',
        title: 'Companies',
      },
      {
        iconName: 'admin_panel_settings',
        route: '/settings/roles',
        title: 'Roles',
      },
      {
        iconName: 'check_circle',
        route: '/settings/permissions',
        title: 'Permissions',
      },
    ]);

    super(menuItems);
  }
}
