import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'bifi-app-scaffold',
  imports: [MatToolbarModule, RouterOutlet, MatIcon, MatButtonModule],
  templateUrl: './scaffold.html',
  styleUrl: './scaffold.css',
})
export class Scaffold {
  title = input('');
}
