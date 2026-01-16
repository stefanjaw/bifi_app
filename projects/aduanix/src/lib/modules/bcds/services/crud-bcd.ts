import { ApiRequestManager } from "@avalantec/base-app/resource";
import { bcd } from "../interfaces/bcd";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CrudBCD extends ApiRequestManager<bcd> {
  constructor() {
    super();
    super.endpoint = 'bcd';
  }
}

