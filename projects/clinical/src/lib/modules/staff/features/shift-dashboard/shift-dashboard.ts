import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-shift-dashboard',
  host: { class: 'flex flex-col gap-2 p-6 ms-4 me-4' },
  imports: [TranslatePipe],
  templateUrl: './shift-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Placeholder dashboard component for shift overview */
export class ShiftDashboard {}
