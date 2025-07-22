import { ChangeDetectionStrategy, Component, input } from '@angular/core';
// import { FormNavigator } from '../form-navigator/form-navigator';

@Component({
  selector: 'bifi-app-form-layout',
  imports: [],
  templateUrl: './form-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLayout {
  title = input.required<string>();
}
