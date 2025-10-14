import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bifi-app-countries-list',
  imports: [],
  templateUrl: './countries-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountriesList {}
