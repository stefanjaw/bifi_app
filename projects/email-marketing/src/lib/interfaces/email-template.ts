export interface emailTemplate {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  designJson?: any;
  mjml?: string;
  html?: string;
  thumbnail?: string;
  active: boolean;
}
