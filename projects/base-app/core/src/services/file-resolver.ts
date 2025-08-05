import { inject, Injectable } from '@angular/core';
import { LIB_AUTH_SERVICE } from '@avalantec/base-app/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileResolver {
  private authService = inject(LIB_AUTH_SERVICE);

  /**
   * Given a URL, downloads the file and converts it to a File object.
   *
   * If there is an error, logs the error and returns null.
   *
   * @param url The URL to convert to a File object.
   * @returns A Promise that resolves to a File object, or null if there is an error.
   */
  async resolveFile(url: string): Promise<File | null> {
    try {
      const token = await firstValueFrom(this.authService.idToken$);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();
      const fileName = url.split('/').pop() || 'image';
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error(`Error converting URL ${url} to File`, error);
      return null;
    }
  }

  /**
   * Given an array of URLs, downloads each URL and converts it to a File object.
   *
   * If there is an error downloading a URL, logs the error and skips that URL.
   *
   * @param urls The array of URLs to convert to File objects.
   * @returns A Promise that resolves to an array of File objects.
   */
  private async resolveFiles(urls: string[]): Promise<File[]> {
    const files = [];
    for (const url of urls) {
      const file = await this.resolveFile(url);
      if (file) {
        files.push(file);
      }
    }
    return files;
  }
}
