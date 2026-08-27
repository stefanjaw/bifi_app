import { ChangeDetectionStrategy, Component, DestroyRef, inject, viewChild } from '@angular/core';
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
import { RoomsImportPreviewDialog } from '../rooms-import-preview-dialog/rooms-import-preview-dialog';

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
    RoomsImportPreviewDialog,
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
  private importPreviewDialog = viewChild.required(RoomsImportPreviewDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  roomColumns = roomColumns;
  roomFilters = roomFilters;

  rooms = this.resourceManager.data;

  goToEditRoom = (element: room) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  /**
   * Opens the CSV import preview dialog with the selected file.
   * @param event - The file input change event.
   */
  openImportPreview(event: Event): void {
    const target = event.target as HTMLInputElement;
    const csv = target.files?.[0];
    // Allow selecting the same file again after closing the dialog.
    target.value = '';
    if (csv) {
      this.importPreviewDialog().open(csv);
    }
  }

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
