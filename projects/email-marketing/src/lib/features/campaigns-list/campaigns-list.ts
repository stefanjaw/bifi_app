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
import { CrudEmailCampaigns } from '../../services/crud-email-campaigns';
import { emailCampaign } from '../../interfaces/email-campaign';
import { emailCampaignColumns } from '../../libraries/email-campaign-columns';
import { emailCampaignFilters } from '../../libraries/email-campaign-filters';

@Component({
  selector: 'bifi-app-campaigns-list',
  providers: [provideResourceManager(CrudEmailCampaigns)],
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
  templateUrl: './campaigns-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignsList {
  private resourceManager = inject<ResourceManager<emailCampaign>>(ResourceManager);
  private crudCampaigns = inject(CrudEmailCampaigns);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  columns = emailCampaignColumns;
  filters = emailCampaignFilters;

  campaigns = this.resourceManager.data;

  goToEdit = (element: emailCampaign) => {
    this.router.navigate(['edit', element._id], { relativeTo: this.route });
  };

  deleteCampaign(id: string) {
    this.crudCampaigns
      .delete({ _id: id })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          if (res) this.campaigns.reload();
        },
      });
  }
}
