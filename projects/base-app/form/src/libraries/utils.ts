import type { FormUploaderFile } from '../interfaces/form-uploader-image';

export function isFormUploaderFile(data: unknown): data is FormUploaderFile {
  return !!data && typeof data === 'object' && 'file' in data && data.file instanceof File;
}

export function isFormUploaderFileArray(data: unknown): data is FormUploaderFile[] {
  return Array.isArray(data) && data.every(isFormUploaderFile);
}
