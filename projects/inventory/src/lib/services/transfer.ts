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

  /**
   * Initiates an inventory transfer between warehouse locations
   * @param data - The transfer payload including product, source/destination locations, and quantity
   */
  transfer(data: TransferPayload) {
    return this.post({ data: data as Record<string, any> });
  }
}
