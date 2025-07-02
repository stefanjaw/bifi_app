import { company } from './../interfaces/company';
import { Injectable } from '@angular/core';
import { ApiRequestManager } from '../../../../common';

@Injectable({
  providedIn: 'root',
})
export class CrudCompanies extends ApiRequestManager {
  constructor() {
    super();
  }

  getCompanies(): company[] {
    return [
      {
        _id: 'c1a2b3',
        name: 'TechNova Solutions',
      },
      {
        _id: 'c2b3c4',
        name: 'GreenCore Industries',
      },
      {
        _id: 'c3c4d5',
        name: 'QuantumSoft',
      },
      {
        _id: 'c4d5e6',
        name: 'BluePeak Technologies',
      },
      {
        _id: 'c5e6f7',
        name: 'SolarEdge Corp',
      },
      {
        _id: 'c6f7g8',
        name: 'Nimbus Analytics',
      },
      {
        _id: 'c7g8h9',
        name: 'Oceanix Global',
      },
      {
        _id: 'c8h9i0',
        name: 'EcoSphere Ventures',
      },
      {
        _id: 'c9i0j1',
        name: 'FutureWorks Inc.',
      },
      {
        _id: 'c0j1k2',
        name: 'Vertex Dynamics',
      },
    ];
  }
}
