import { inject, Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { FormUploaderFile } from '@avalantec/base-app/form';
import { Observable } from 'rxjs';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';

export interface BugReportPayload {
  name: string;
  description?: string;
  category?: string;
  appModule?: string;
  attachments?: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class CrudBugReport extends ApiRequestManager<unknown> {
  private readonly bugReportingUrl = inject(LIBRARY_CONFIG).bugReportingURL;

  constructor() {
    super();
  }

  postBugReport(data: BugReportPayload): Observable<unknown> {
    const formData = this.createFormDataFromObject(data as Record<string, any>, ['attachments']);
    return this._httpClient.post<unknown>(this.bugReportingUrl, formData);
  }
}
