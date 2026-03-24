import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudProjects } from '../../services/crud-projects';
import { projectColumns } from '../../libraries/project-columns';
import { project } from '../../interfaces/projects';

@Component({
  selector: 'bifi-app-projects-list',
  providers: [provideResourceManager(CrudProjects)],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink],
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
  projects = this.resourceManager.data;

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
