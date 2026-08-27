import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetRoster } from '../interfaces/asset-roster';
import { Observable } from 'rxjs';
import { FormUploaderFile } from '@avalantec/base-app/form';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetRoster extends ApiRequestManager<assetRoster> {
  constructor() {
    super();
    super.endpoint = 'asset-rosters';
  }

  /**
   * Sends documents and an optional AI question for document analysis
   * @param files - The document files to analyze
   * @param question - Optional AI question to ask about the documents
   * @returns Observable of the document analysis result
   */
  readDocuments(files: FormUploaderFile[], question?: string): Observable<any> {
    return this.post({
      data: {
        attachments: files,
        question,
      },
      specificEndpoint: 'read-documents',
      fileFields: ['attachments'],
    }) as any;
  }

  /**
   * Downloads a CSV containing only the Asset Roster records identified by IDs.
   * @param ids - The Asset Roster ids to export.
   */
  exportSelectedCSV(ids: string[]): void {
    const params = new URLSearchParams({
      ids: ids.join(','),
    });

    const url = `${this.formatFullURL()}/export?${params.toString()}`;

    this._fileResolver.downloadFileInBrowser({ url }, 'download');
  }

  /**
   * Soft-archives the selected Asset Roster records.
   * @param ids - The Asset Roster ids to archive.
   * @returns Observable of the archived count, or undefined on failure.
   */
  archiveSelected(ids: string[]): Observable<{ archivedCount: number } | undefined> {
    return this.post<{ archivedCount: number }>({
      data: { ids },
      specificEndpoint: 'archive',
      notificationConfig: { enable: false },
    });
  }

  /**
   * Restores the selected archived Asset Roster records.
   * @param ids - The Asset Roster ids to restore.
   * @returns Observable of the unarchived count, or undefined on failure.
   */
  unarchiveSelected(ids: string[]): Observable<{ unarchivedCount: number } | undefined> {
    return this.post<{ unarchivedCount: number }>({
      data: { ids },
      specificEndpoint: 'unarchive',
      notificationConfig: { enable: false },
    });
  }
}
