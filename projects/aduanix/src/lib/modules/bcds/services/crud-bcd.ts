import { ApiRequestManager } from '@avalantec/base-app/resource';
import { bcd } from '../interfaces/bcd';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrudBCD extends ApiRequestManager<bcd> {
  constructor() {
    super();
    super.endpoint = 'bcds';
  }

  /**
   * Uploads a BCD record as a CSV file to the FTP server.
   * The function fetches the BCD record by the provided `_id` and validates its existence.
   * If the BCD record has already been sent to the government (status !== "DRAFT"),
   * a ValidationException is thrown.
   * The function generates a new filename for the CSV file and uploads the file to the FTP server.
   * The function also uploads the file to GridFS and updates the BCD record with the uploaded file information.
   * The function returns the updated BCD record document.
   *
   * @param id - The ID of the BCD record to upload as a CSV file.
   * @returns The updated BCD record document.
   */
  uploadBCDDataToFTP(id: string) {
    return this.post({
      data: {},
      specificEndpoint: `upload-ftp/${id}`,
    });
  }

  /**
   * Updates BCD documents by checking FTP for new files and updating the documents accordingly.
   * The function runs within a transaction and returns an array of updated BCD documents.
   * The function first gets all BCD documents with the status "PENDING_RESPONSE".
   * Then it lists all files in the FTP folder "/outbox".
   * If no files are found, the function returns an empty array.
   * For each BCD document, the function checks if a REC.TXT file is present in the FTP folder.
   * If a REC.TXT file is found, the function gets the BCD number from the file and finds all files with that number in the FTP folder.
   * If no REC.TXT file is found, the function checks if an error file is present in the FTP folder.
   * If an error file is found, the function adds it to the array of files to process.
   * The function then uploads the files to GridFS and updates the BCD documents with the uploaded files.
   * The function then moves the files from the FTP folder "/outbox" to "/outbox/proccessed".
   * @returns {Promise<bcd[]>} - An array of updated BCD documents.
   */
  updateBCDsFromFTP() {
    return this.put({
      data: {},
      specificEndpoint: 'update-ftp',
    });
  }
}
