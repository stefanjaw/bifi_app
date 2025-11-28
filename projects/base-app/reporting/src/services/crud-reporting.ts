import { inject, Injectable } from '@angular/core';
import { ToastManager } from '@avalantec/base-app/core';
import { reporting } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';
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

  async downloadReport(id: string) {
    try {
      const blob = await firstValueFrom(
        this._httpClient.get(`${this.formatFullURL()}/generate-report?reportId=${id}`, {
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
