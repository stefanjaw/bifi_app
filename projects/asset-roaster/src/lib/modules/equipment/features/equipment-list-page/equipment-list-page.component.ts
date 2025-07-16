import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EquipmentStatusCardComponent } from '../../ui/equipment-status-card/equipment-status-card.component';
import { CrudUsers } from '@avalantec/base-app';

@Component({
  selector: 'app-equipment-list-page',
  host: { class: 'flex flex-col gap-2 p-4' },
  imports: [EquipmentStatusCardComponent],
  templateUrl: './equipment-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentListPageComponent {
  // Test para probar que se importe la variable

  testService = inject(CrudUsers);
}
