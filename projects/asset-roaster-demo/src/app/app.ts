import { Component, inject, OnInit } from '@angular/core';
import { MainMenuManager } from '@avalantec/base-app/core';
import { Scaffold } from '@avalantec/base-app/ui';

@Component({
  selector: 'bifi-app-root',
  imports: [Scaffold],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'bifi_app_testing';
  private mainMenuManager = inject(MainMenuManager);

  ngOnInit(): void {
    this.mainMenuManager.addItems([
      {
        icon: 'pi pi-objects-column',
        routerLink: ['/asset-roaster'],
        label: 'Asset Roaster',
      },
    ]);
  }
}
