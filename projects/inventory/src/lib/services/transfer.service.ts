import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';

export interface TransferPayload {
  productId: string;
  fromWarehouseId: string;
  fromLocationId: string;
  toWarehouseId: string;
  toLocationId: string;
  quantity: number;
  reference?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransferService extends ApiRequestManager<any> {
  constructor() {
    super();
    super.endpoint = 'inventory/transfers';
  }

  transfer(data: TransferPayload) {
    return this.post({ data: data as Record<string, any> });
  }
}
