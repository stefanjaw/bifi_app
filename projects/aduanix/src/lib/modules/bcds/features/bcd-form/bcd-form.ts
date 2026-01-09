import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'bifi-app-bcd-form',
  imports: [],
  templateUrl: './bcd-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdForm {



    id = input.required<string>();
  
}
