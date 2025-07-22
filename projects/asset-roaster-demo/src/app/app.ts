import { Component, inject, OnInit } from '@angular/core';
import { MainMenuManager, Scaffold } from '@avalantec/base-app/core';

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
        iconName: 'handshake',
        route: 'asset-roaster',
        title: 'Asset Roaster',
      },
    ]);
  }
}
