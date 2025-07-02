import { TestBed } from '@angular/core/testing';

import { MainMenuManager } from './main-menu-manager';

describe('MainMenuManager', () => {
  let service: MainMenuManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainMenuManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
