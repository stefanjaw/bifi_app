import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudSubscribers } from '../../services/crud-subscribers';
import { subscriber } from '../../interfaces/subscriber';
import { subscriberColumns } from '../../libraries/subscriber-columns';
import { subscriberFilters } from '../../libraries/subscriber-filters';

@Component({
  selector: 'bifi-app-subscribers-list',
  providers: [provideResourceManager(CrudSubscribers)],
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
  templateUrl: './subscribers-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscribersList {
  private resourceManager = inject<ResourceManager<subscriber>>(ResourceManager);
  private crudSubscribers = inject(CrudSubscribers);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = subscriberColumns;
  filters = subscriberFilters;

  subscribers = this.resourceManager.data;

  goToEdit = (element: subscriber) => {
    this.router.navigate(['edit', element._id], { relativeTo: this.route });
  };

  deleteSubscriber(id: string) {
    this.crudSubscribers
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.subscribers.reload();
        },
      });
  }
}
