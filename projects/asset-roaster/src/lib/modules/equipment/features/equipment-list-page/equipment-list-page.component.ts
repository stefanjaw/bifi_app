import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EquipmentStatusCardComponent } from '../../ui/equipment-status-card/equipment-status-card.component';
import { ApiRequestManager } from 'base-app';

@Component({
  selector: 'app-equipment-list-page',
  imports: [EquipmentStatusCardComponent],
  templateUrl: './equipment-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentListPageComponent {
  // Test para probar que se importe la variable
  test: ApiRequestManager<any> = null!;
}
