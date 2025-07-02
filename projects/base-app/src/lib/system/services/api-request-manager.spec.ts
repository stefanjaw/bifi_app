import { TestBed } from '@angular/core/testing';

import { ApiRequestManager } from './api-request-manager';

describe('ApiRequestManager', () => {
  let service: ApiRequestManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRequestManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
