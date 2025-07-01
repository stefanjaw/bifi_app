import { TestBed } from '@angular/core/testing';

import { SidenavManager } from './sidenav-manager';

describe('SidenavManager', () => {
  let service: SidenavManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidenavManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
