import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  ButtonsActions,
  provideResourceManager,
  ResourceManager,
  SearchBar,
  TableLayout,
} from '@avalantec/base-app/resource';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HasPermission } from '@avalantec/base-app/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudEmailTemplates } from '../../services/crud-email-templates';
import { emailTemplate } from '../../interfaces/email-template';
import { emailTemplateColumns } from '../../libraries/email-template-columns';
import { emailTemplateFilters } from '../../libraries/email-template-filters';

@Component({
  selector: 'bifi-app-templates-list',
  providers: [provideResourceManager(CrudEmailTemplates)],
  imports: [
    TableLayout,
    ButtonModule,
    SearchBar,
    RouterLink,
    HasPermission,
    ButtonsActions,
  ],
  host: {
    class: 'flex flex-col gap-2 p-6 ms-4 me-4',
  },
  templateUrl: './templates-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesList {
  private resourceManager = inject<ResourceManager<emailTemplate>>(ResourceManager);
  private crudTemplates = inject(CrudEmailTemplates);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = emailTemplateColumns;
  filters = emailTemplateFilters;

  templates = this.resourceManager.data;

  goToEdit = (element: emailTemplate) => {
    this.router.navigate(['edit', element._id], { relativeTo: this.route });
  };

  deleteTemplate(id: string) {
    this.crudTemplates
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.templates.reload();
        },
      });
  }
}
