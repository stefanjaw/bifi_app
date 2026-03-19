import { Injectable } from '@angular/core';
import { ApiRequestManager } from './api-request-manager';
import { activityHistory } from '../interfaces/activity-history';

@Injectable({
  providedIn: 'root',
})
export class CrudActivityHistories extends ApiRequestManager<activityHistory> {
  constructor() {
    super();
    super.endpoint = 'activity-histories';
  }

  /**
   * Exports all documents of the collection in CSV format to a file.
   * If assetRosterId is provided, it will export only the documents with the given assetRosterId.
   * The file is named "export.csv".
   * @param assetRosterId - The id of the assetRoster to export.
   */
  override exportCSV(assetRosterId?: string): void {
    const fullURL = `${this.formatFullURL()}/export?assetRosterId=${assetRosterId}`;
    this._fileResolver.downloadFileInBrowser({ url: fullURL }, 'download');
  }
}
