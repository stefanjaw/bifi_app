import { CommonModule } from '@angular/common';
import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { IFormSection } from '../../interfaces/form-navigation';
import { FormSections } from '../../services/form-sections';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'bifi-app-form-navigator',
  templateUrl: './form-navigator.html',
})
export class FormNavigator implements OnDestroy {
  private sectionsService = inject(FormSections);
  private scrollListener?: () => void;
  private isScrolling = signal(false);

  sections = this.sectionsService.sections;
  active = this.sectionsService.activeSection;

  constructor() {
    effect(() => {
      const secs = this.sections();

      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
      }

      if (secs.length > 0) {
        this.setupScrollListener(secs);
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private setupScrollListener(sections: IFormSection[]) {
    this.scrollListener = this.throttle(() => {
      if (!this.isScrolling()) {
        this.updateActiveSection(sections);
      }
    }, 100);

    window.addEventListener('scroll', this.scrollListener, { passive: true });

    // Establecer sección inicial
    setTimeout(() => this.updateActiveSection(sections), 100);
  }

  private updateActiveSection(sections: IFormSection[]) {
    const scrollY = window.scrollY;
    const offset = 120; // Offset para activar la sección un poco antes

    let activeSection: string | null = null;

    // Encontrar la sección activa basada en la posición de scroll
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.element && section.element.offsetTop <= scrollY + offset) {
        if (section.id !== this.active()) {
          activeSection = section.id;
        }
        break;
      }
    }

    if (activeSection) this.sectionsService.setActiveSection(activeSection);
  }

  private throttle(func: () => void, limit: number) {
    let inThrottle: boolean;
    return () => {
      if (!inThrottle) {
        func();
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  scrollTo(section: IFormSection) {
    this.isScrolling.set(true);
    this.sectionsService.setActiveSection(section.id);

    section.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // Alinear al inicio del viewport
    });

    setTimeout(() => {
      this.isScrolling.set(false);
    }, 1000);
  }
}
