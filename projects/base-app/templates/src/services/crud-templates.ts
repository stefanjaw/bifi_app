import { Injectable } from '@angular/core';
import { template } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';

@Injectable({
  providedIn: 'root',
})
export class CrudTemplates extends ApiRequestManager<template> {
  constructor() {
    super();
    this.endpoint = 'templates';
  }
}
