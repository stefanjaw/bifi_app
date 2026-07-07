import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { room } from '../../interfaces/room';
import { roomColumns } from '../../libraries/room-columns';
import { roomFilters } from '../../libraries/room-filters';
import { CrudRooms } from '../../services/crud-rooms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-rooms-list',
  providers: [provideResourceManager(CrudRooms)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TranslatePipe,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './rooms-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsList {
  private resourceManager = inject<ResourceManager<room>>(ResourceManager);
  private crudRooms = inject(CrudRooms);
  private destroy$ = inject(DestroyRef);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  roomColumns = roomColumns;
  roomFilters = roomFilters;

  rooms = this.resourceManager.data;

  goToEditRoom = (element: room) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };
  deleteRoom(id: string) {
    this.crudRooms
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.rooms.reload();
        },
      });
  }
}
