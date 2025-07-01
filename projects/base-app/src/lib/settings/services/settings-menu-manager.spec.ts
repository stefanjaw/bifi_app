import { TestBed } from '@angular/core/testing';

import { SettingsMenuManager } from './settings-menu-manager';

describe('SettingsMenuManager', () => {
  let service: SettingsMenuManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsMenuManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
