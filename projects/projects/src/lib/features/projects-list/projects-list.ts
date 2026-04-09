import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import {
  ButtonsActions,
  FilterBar,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
  TimelineItem,
  TimelineView,
} from '@avalantec/base-app/resource';
import { HasPermission } from '@avalantec/base-app/auth';
import { CrudProjects } from '../../services/crud-projects';
import { projectColumns } from '../../libraries/project-columns';
import { project } from '../../interfaces/projects';
import { projectFilterFields, projectFilters } from '../../libraries/project-filters';

@Component({
  selector: 'bifi-app-projects-list',
  providers: [provideResourceManager(CrudProjects)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
    TimelineView,
    FilterBar,
  ],
  templateUrl: './projects-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList {
  private resourceManager = inject<ResourceManager<project>>(ResourceManager);
  private crudProjects = inject(CrudProjects);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectColumns = projectColumns;
  projectFilters = projectFilters;
  projectFilterFields = projectFilterFields;
  projects = this.resourceManager.data;

  viewState = signal<'list' | 'timeline'>('list');

  timelineItems = computed<TimelineItem[]>(() => {
    const docs = this.projects.value()?.docs ?? [];
    return docs
      .filter(p => p.dateEnd)
      .sort((a, b) => new Date(a.dateEnd).getTime() - new Date(b.dateEnd).getTime())
      .map(p => ({
        label: p.name,
        date: p.dateEnd,
        type: 'end' as const,
        action: () => this.router.navigate(['../edit', p._id], { relativeTo: this.route }),
      }));
  });

  goToEditProject = (element: project) => {
    this.router.navigate(['../edit', element._id], { relativeTo: this.route });
  };

  deleteProject(id: string) {
    this.crudProjects
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.projects.reload();
        },
      });
  }
}
