import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bifi-app-form-hint',
  imports: [],
  template: `
    <p class="text-muted-color text-sm">
      <ng-content></ng-content>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hint {}
