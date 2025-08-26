import { inject } from '@angular/core';
import { MainMenuManager } from '@avalantec/base-app/core';
import { ResourceList } from '@avalantec/base-app/settings';
import { PrimeIcons } from 'primeng/api';

export function initializeAssetRoster() {
  initializeMenu();
  initializeResources();
}

function initializeMenu() {
  const menuManager = inject(MainMenuManager);

  menuManager.addItems([
    {
      icon: PrimeIcons.OBJECTS_COLUMN,
      routerLink: ['/asset-roaster'],
      label: 'Asset Roaster',
    },
  ]);
}

function initializeResources() {
  const resourceList = inject(ResourceList);
  resourceList.add([
    {
      name: 'facilities',
      keySuggesstions: [
        { key: '_id', name: 'ID' },
        { key: 'name', name: 'Name' },
      ],
    },
    {
      name: 'products',
      keySuggesstions: [
        { key: '_id', name: 'ID' },
        { key: 'name', name: 'Name' },
        { key: 'status', name: 'Status' },
      ],
    },
  ]);
}
