import { Component, input, output } from '@angular/core';
import { HasPermission, permission } from '@avalantec/base-app/auth';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bifi-app-buttons-actions',
  imports: [ButtonModule, HasPermission],
  templateUrl: './buttons-actions.html',
})
export class ButtonsActions {
  position = input<'start' | 'end'>('end');

  editClicked = output<void>();
  deleteClicked = output<void>();

  showDelete = input<boolean>(true);

  permission = input<permission>();

  get editPermission(): permission {
    return `${this.permission()}/update:view` as permission;
  }

  get deletePermission(): permission {
    return `${this.permission()}:delete:model` as permission;
  }
}
