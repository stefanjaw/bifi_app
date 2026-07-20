import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe, LocaleDatePipe } from '@avalantec/base-app/i18n';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudRecurrentTasks } from '../../../clinical-tasks/services/crud-recurrent-tasks';
import { recurrentTask } from '../../../clinical-tasks/interfaces/recurrent-task';

/** Patient-scoped tasks view */
@Component({
  selector: 'bifi-app-patient-tasks',
  imports: [
    CommonModule,
    CardModule,
    SkeletonModule,
    TagModule,
    RouterLink,
    TranslatePipe,
    LocaleDatePipe,
  ],
  templateUrl: './patient-tasks.html',
  host: { class: 'flex flex-col gap-4 p-4' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientTasks {
  private route = inject(ActivatedRoute);
  private crudTasks = inject(CrudRecurrentTasks);
  private destroy$ = inject(DestroyRef);

  patientId = signal<string>('');
  tasks = signal<recurrentTask[]>([]);
  loading = signal(true);

  constructor() {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('patientId');
      if (id) {
        this.patientId.set(id);
        this.crudTasks
          .getByContact(id)
          .pipe(takeUntilDestroyed(this.destroy$))
          .subscribe({
            next: res => {
              this.tasks.set(res);
              this.loading.set(false);
            },
          });
      }
    });
  }
}
