import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-form-select-footer',
  imports: [CommonModule],
  templateUrl: './form-select-footer.html',
})
export class FormSelectFooter {
  label = input.required<string>();

  showForm = signal(false);

  toggleForm(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.showForm.update(v => !v);
  }

  close() {
    this.showForm.set(false);
  }
}
