import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EquipmentStatusCardComponent } from '@asset-roaster/src/lib/modules/equipment/ui/equipment-status-card/equipment-status-card.component';

@Component({
  selector: 'app-equipment-list-page',
  imports: [EquipmentStatusCardComponent],
  templateUrl: './equipment-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentListPageComponent {}
