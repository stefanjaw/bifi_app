import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { FormSections } from '../../services/form-sections';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'bifi-app-form-section',
  imports: [DividerModule],
  host: { class: 'block bg-white p-7 rounded-lg', '[id]': 'id()' },
  templateUrl: './form-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSection implements AfterViewInit, OnDestroy {
  private sectionsService = inject(FormSections);
  private el = inject(ElementRef);

  title = input.required<string>();
  id = input.required<string>();
  ordinal = input<number>();

  ngAfterViewInit(): void {
    this.sectionsService.registerSection({
      id: this.id(),
      title: this.title(),
      element: this.el.nativeElement,
    });
  }

  ngOnDestroy(): void {
    this.sectionsService.unregisterSection(this.id());
  }
}
