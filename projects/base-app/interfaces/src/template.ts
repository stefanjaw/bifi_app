export interface template {
  _id: string;
  name: string;
  codeOriginal?: string;
  codeCustom?: string;
  directory: string;
  filename: string;
  mimeType:
    | 'text/typescript'
    | 'application/typescript'
    | 'application/javascript'
    | 'text/javascript'
    | 'text/html'
    | 'text/css';
  active?: boolean;
}
