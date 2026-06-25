import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { firstValueFrom } from 'rxjs';
import { file } from '../interfaces/file';

type imageSize = 'icon' | 'full' | 'preview' | undefined;

type ResolveFileProps =
  | {
      id: string;
    }
  | {
      url: string;
    }
  | {
      file: File;
    }
  | {
      metadata: file;
    };

@Injectable({
  providedIn: 'root',
})
export class FileResolver {
  private libraryConfig = inject(LIBRARY_CONFIG);
  private httpClient = inject(HttpClient);

  /**
   * Given a ResolveFileProps object, returns the URL to the file.
   *
   * If the object has an 'id' property, it returns the URL to the file resource
   * with the given id. Otherwise, it returns the value of the 'url' property.
   *
   * @param props The ResolveFileProps object with either 'id' or 'url' properties.
   * @returns The URL to the file.
   */
  private resolveUrl(props: ResolveFileProps, imageSize: imageSize = undefined): string {
    const sizeParam = imageSize ? `?imageSize=${imageSize}` : '';

    if ('id' in props) {
      return `${this.libraryConfig.apiURL}/files/${props.id}${sizeParam}`;
    } else if ('url' in props) {
      return props.url + sizeParam;
    } else if ('file' in props) {
      return URL.createObjectURL(props.file) + sizeParam;
    } else {
      return this.resolveUrl({ id: props.metadata.fileId }, imageSize);
    }
  }

  private extractFilenameFromContentDisposition(header: string | null): string | null {
    if (!header) return null;
    const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        /* fall through */
      }
    }
    const match = header.match(/filename="?([^";\n]+)"?/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Given a URL, downloads the file and converts it to a File object.
   *
   * If there is an error, logs the error and returns null.
   *
   * @param url The URL to convert to a File object.
   * @returns A Promise that resolves to a File object, or null if there is an error.
   */
  async resolveFile(
    props: ResolveFileProps,
    imageSize: imageSize = undefined
  ): Promise<File | null> {
    if ('file' in props) {
      return props.file;
    }

    const url = this.resolveUrl(props, imageSize);

    try {
      const response = await firstValueFrom(
        this.httpClient.get(url, { responseType: 'blob', observe: 'response' })
      );
      const blob = response.body!;
      let fileName: string;
      if ('metadata' in props) {
        fileName = props.metadata.name;
      } else {
        const fromHeader = this.extractFilenameFromContentDisposition(
          response.headers.get('Content-Disposition')
        );
        fileName = fromHeader ?? url.split('/').pop() ?? 'file';
      }
      return new File([blob], fileName, { type: blob.type });
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
  async resolveFiles(props: ResolveFileProps[], imageSize: imageSize = undefined): Promise<File[]> {
    const files = [];
    for (const prop of props) {
      const file = await this.resolveFile(prop, imageSize);
      if (file) {
        files.push(file);
      }
    }
    return files;
  }

  /**
   * Downloads a file from the given URL and opens it in a new browser tab.
   *
   * If there is an error downloading the file, throws an error.
   *
   * @param url The URL of the file to download.
   * @returns A Promise that resolves when the file is downloaded and opened in a new browser tab.
   */
  async downloadFileInBrowser(
    props: ResolveFileProps,
    mode: 'download' | 'open' = 'open',
    imageSize: imageSize = undefined
  ) {
    const file = await this.resolveFile(props, imageSize);

    if (file && mode === 'open') {
      const blobUrl = URL.createObjectURL(file);
      window.open(blobUrl, '_blank');
    } else if (file && mode === 'download') {
      const blobUrl = URL.createObjectURL(file);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name ?? 'download'; // give a default name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);
    } else {
      throw new Error('Error downloading file');
    }
  }
}
