import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ControlContainer } from '@angular/forms';
import { DraftService } from '../../services/draft.service';

@Component({
  selector: 'bifi-app-form-select-navigate-footer',
  imports: [CommonModule],
  templateUrl: './form-select-navigate-footer.html',
})
export class FormSelectNavigateFooter {
  label = input.required<string>();
  createRoute = input.required<any[]>();
  controlName = input<string>();
  draftFormValue = input<any>();

  private router = inject(Router);
  private draftService = inject(DraftService);
  private controlContainer = inject(ControlContainer, { optional: true });

  navigate(route: any[]) {
    this.draftService.isDraftNavigating = true;

    if (this.draftFormValue()) {
      this.draftService.saveDraft(this.router.url, this.draftFormValue());
    } else if (this.controlContainer && this.controlContainer.control) {
      this.draftService.saveDraft(this.router.url, this.controlContainer.control.value);
    }

    // Navigate with returnUrl and optional controlName
    const queryParams: any = { returnUrl: this.router.url };
    const cName = this.controlName();
    if (cName) {
      queryParams['controlName'] = cName;
    }
    
    this.router.navigate(route, { queryParams });
  }
}
