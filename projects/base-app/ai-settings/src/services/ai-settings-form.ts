import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface AiSettingsFormModel {
  aiProvider: string;
  apiKey: string;
  model: string;
  embeddingModel: string;
  maxTokenLimit: string;
}

@Injectable({ providedIn: 'root' })
export class AiSettingsForm extends BaseForm<AiSettingsFormModel> {
  override createForm() {
    return this.fb.group<AiSettingsFormModel>({
      aiProvider: ['google-gems'],
      apiKey: [''],
      model: ['gemini-2.5-flash'],
      embeddingModel: ['text-embedding-004'],
      maxTokenLimit: ['10000'],
    });
  }
}
