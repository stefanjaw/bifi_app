import { ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { ToolbarManager } from '@avalantec/base-app/core';
import { HELPDESK_ROUTES } from '../../routes/helpdesk.routes';
import { HELPDESK_STAGES_ROUTES } from '../../modules/helpdesk-stages';
import { PrimeIcons } from 'primeng/api';
import { BugReportDialog } from '../../features/bug-report-dialog/bug-report-dialog';

export function initializeHelpdesk() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);
  const toolbarManager = inject(ToolbarManager);
  const appRef = inject(ApplicationRef);
  const envInjector = inject(EnvironmentInjector);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.INBOX,
        routerLink: ['/helpdesk'],
        label: 'Helpdesk',
        resource: 'helpdesk/menu',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'Helpdesk',
        resource: 'helpdesk/settings/menu',
        items: [
          {
            icon: PrimeIcons.LIST,
            routerLink: ['/settings/helpdesk/helpdesk-stages'],
            label: 'Helpdesk Stages',
            resource: 'helpdesk-stages/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    basePath: 'helpdesk',
    newRouting: HELPDESK_ROUTES,
  });

  mainRoutingManager.addRouting({
    newRouting: {
      path: 'helpdesk',
      children: [
        {
          path: 'helpdesk-stages',
          children: HELPDESK_STAGES_ROUTES,
        },
      ],
    },
    childOf: 'settings',
  });

  let dialogRef: ReturnType<typeof createComponent<BugReportDialog>> | null = null;

  toolbarManager.addItem({
    icon: PrimeIcons.TICKET,
    tooltip: 'Report a Bug',
    command: () => {
      if (!dialogRef) {
        dialogRef = createComponent(BugReportDialog, { environmentInjector: envInjector });
        appRef.attachView(dialogRef.hostView);
        document.body.appendChild(dialogRef.location.nativeElement);
      }
      dialogRef.instance.openDialog();
    },
  });
}
