import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { HasPermission } from '@avalantec/base-app/auth';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudSequences } from '../../services/crud-sequences';
import { sequenceColumns } from '../../libraries/sequence-columns';
import { sequence } from '../../interfaces/sequence';

@Component({
  selector: 'bifi-app-sequences-list',
  providers: [provideResourceManager(CrudSequences)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, SearchBar, HasPermission, RouterLink],
  templateUrl: './sequences-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SequencesList {
  private resourceManager = inject<ResourceManager<sequence>>(ResourceManager);
  private crudSequences = inject(CrudSequences);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  sequenceColumns = sequenceColumns;
  sequences = this.resourceManager.data;

  goToEditSequence = (element: sequence) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  deleteSequence(id: string) {
    this.crudSequences
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.sequences.reload();
        },
      });
  }
}
