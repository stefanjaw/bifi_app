import { Component } from '@angular/core';
import { Scaffold } from '@avalantec/base-app/ui';

@Component({
  selector: 'bifi-app-root',
  imports: [Scaffold],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'bifi_app_testing';
}
