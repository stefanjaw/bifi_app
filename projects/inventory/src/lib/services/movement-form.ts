import { effect, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface MovementFormModel {
  type: string;
  productId: string;
  warehouseId: string;
  locationId: string;
  quantity: number;
  reference: string;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class MovementFormService extends BaseForm<MovementFormModel> {
  selectedWarehouseId = signal<string>('');

  private warehouseIdChanges = toSignal(
    this.form.get('warehouseId')!.valueChanges,
    { initialValue: '' },
  );

  override createForm() {
    return this.fb.group<MovementFormModel>({
      type: ['IN', [Validators.required]],
      productId: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      locationId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reference: [''],
      notes: [''],
    });
  }

  constructor() {
    super();
    effect(() => {
      const wid = this.warehouseIdChanges();
      this.selectedWarehouseId.set(wid ?? '');
      this.form.patchValue({ locationId: '' }, { emitEvent: false });
    });
  }
}
