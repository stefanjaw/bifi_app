import { Component, inject, OnInit, signal } from '@angular/core';
import { MainMenuManager, Scaffold } from 'base-app';

@Component({
  selector: 'app-root',
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
        route: 'crm',
        title: 'CRM',
      },
      {
        iconName: 'date_range',
        route: 'shifts',
        title: 'Shifts',
      },
      {
        iconName: 'date_range',
        route: 'shifts',
        title: 'Shifts',
      },
    ]);
  }
}
