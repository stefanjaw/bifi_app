import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ControlContainer } from '@angular/forms';
import { DraftService } from '../../services/draft-service';

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
  formGroup = input<any>(); // Optional FormGroup to extract dirty keys

  private router = inject(Router);
  private draftService = inject(DraftService);
  private controlContainer = inject(ControlContainer, { optional: true });

  navigate(route: any[]) {
    console.log('Navigating to:', route);
    console.log('DraftFormValue:', this.draftFormValue());
    console.log('ControlContainer:', this.controlContainer);

    this.draftService.isDraftNavigating = true;

    let dataToSave = this.draftFormValue();
    let dirtyKeys: string[] | undefined;

    const group = this.formGroup() || (this.controlContainer && this.controlContainer.control);
    if (group) {
      if (!dataToSave) {
        dataToSave = group.value;
      }
      if (group.controls) {
        dirtyKeys = Object.keys(group.controls).filter(key => group.get(key)!.dirty);
      }
    }

    if (dataToSave) {
      this.draftService.saveDraft(this.router.url, dataToSave, dirtyKeys);
    }

    // Navigate with returnUrl and optional controlName
    const queryParams: any = { returnUrl: this.router.url };
    const cName = this.controlName();
    if (cName) {
      queryParams['controlName'] = cName;
    }

    // Force component recreation if navigating to the same route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(route, { queryParams });
    });
  }
}
