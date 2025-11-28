import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ReportingFormModel {
  model: string;
  template: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportingForm extends BaseForm<ReportingFormModel> {
  private defaultTemplate = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
          /* Your styles here */
        </style>
      </head>
      <body>
        <!-- your template here -->
      </body>
    </html>
  `;

  override createForm() {
    return this.fb.group<ReportingFormModel>({
      model: ['', [Validators.required]],
      template: [this.defaultTemplate, [Validators.required]],
    });
  }

  override reset(): void {
    super.reset();
    
    this.form.patchValue({
      template: this.defaultTemplate,
    });
  }
}
