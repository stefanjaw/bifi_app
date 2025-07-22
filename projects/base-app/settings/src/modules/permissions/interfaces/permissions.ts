export interface permission {
  _id: string;
  permission: string; // ej. 'user.read'
  description?: string; // ej. 'Allows reading users'
}
