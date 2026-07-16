import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DirtyFormConfirmationService {
  private confirmSubject: Subject<boolean> | null = null;
  isOpen = signal(false);

  requestConfirmation(): Promise<boolean> {
    this.isOpen.set(true);
    this.confirmSubject = new Subject<boolean>();
    return new Promise((resolve) => {
      this.confirmSubject!.subscribe(resolve);
    });
  }

  confirm(): void {
    this.isOpen.set(false);
    if (this.confirmSubject) {
      this.confirmSubject.next(true);
      this.confirmSubject.complete();
      this.confirmSubject = null;
    }
  }

  reject(): void {
    this.isOpen.set(false);
    if (this.confirmSubject) {
      this.confirmSubject.next(false);
      this.confirmSubject.complete();
      this.confirmSubject = null;
    }
  }
}
