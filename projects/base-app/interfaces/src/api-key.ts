/**
 * An API key a user has generated to call the backend from external clients.
 * `maskedKey` is the server-computed non-functional representation (prefix + bullets);
 * the raw key is only ever returned once (on creation), never stored on the backend.
 */
export interface apiKey {
  _id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  lastUsedAt?: string;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}
