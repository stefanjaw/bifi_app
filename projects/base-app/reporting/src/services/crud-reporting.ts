import { inject, Injectable } from '@angular/core';
import { ToastManager } from '@avalantec/base-app/core';
import { reporting } from '@avalantec/base-app/interfaces';
import { ApiRequestManager, orderByQuery } from '@avalantec/base-app/resource';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudReporting extends ApiRequestManager<reporting> {
  private toastManager = inject(ToastManager);

  constructor() {
    super();
    this.endpoint = 'reporting';
  }

  async downloadReport({
    modelName,
    reportId,
    searchParams,
    sort,
    getInactive,
  }: {
    modelName?: string;
    reportId?: string;
    searchParams?: Record<string, any>;
    sort?: orderByQuery<reporting>;
    getInactive?: boolean | null;
  }) {
    try {
      const query = new URLSearchParams({
        ...((searchParams || !getInactive) && {
          searchParams: JSON.stringify({
            ...searchParams,
            ...(typeof getInactive === 'boolean' && !getInactive && { active: true }),
            ...(typeof getInactive === 'boolean' && getInactive && { active: false }),
          }),
        }),
        ...(sort && { orderBy: JSON.stringify(sort) }),
        ...(modelName && { modelName }),
        ...(reportId && { reportId }),
      });

      const blob = await firstValueFrom(
        this._httpClient.get(`${this.formatFullURL()}/generate-report?${query.toString()}`, {
          responseType: 'blob',
        })
      );

      // file
      const file = new File([blob], 'report.pdf', { type: blob.type });

      // download functionality
      const blobURL = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = file.name ?? 'download'; // give a default name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobURL);

      // toast
      this.toastManager.showError('Successfully downloaded report');
    } catch (error: any) {
      this.toastManager.showError('Failed to download report', error.message);
    }
  }
}
