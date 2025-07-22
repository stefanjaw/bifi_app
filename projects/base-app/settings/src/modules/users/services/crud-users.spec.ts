import { TestBed } from '@angular/core/testing';

import { CrudUsers } from './crud-users';

describe('CrudUsers', () => {
  let service: CrudUsers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudUsers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
