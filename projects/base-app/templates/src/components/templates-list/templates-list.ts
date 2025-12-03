import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import {
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { CrudTemplates } from '../../services/crud-templates';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { template } from '@avalantec/base-app/interfaces';
import { templateFilters } from '../../libraries/template-filters';
import { templateColumns } from '../../libraries/template-columns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-templates-list',
  providers: [provideResourceManager(CrudTemplates)],
  imports: [TableLayout, ButtonModule, SearchBar, RouterLink, HasPermission],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './templates-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesList {
  private resourceManager = inject<ResourceManager<template>>(ResourceManager);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private crudTemplates = inject(CrudTemplates);
  private destroy$ = inject(DestroyRef);

  templateColumns = templateColumns;
  templateFilters = templateFilters;

  reportings = this.resourceManager.data;

  deleteTemplate(id: string) {
    this.crudTemplates
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.reportings.reload();
        },
      });
  }

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route.parent });
  }

  goToEdit(_id: string) {
    this.router.navigate(['edit', _id], { relativeTo: this.route.parent });
  }
}
