import { TestBed } from '@angular/core/testing';

import { CrudCompanies } from './crud-companies';

describe('CrudCompanies', () => {
  let service: CrudCompanies;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudCompanies);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
