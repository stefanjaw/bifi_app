import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMainMenu } from './settings-main-menu';

describe('SettingsMainMenu', () => {
  let component: SettingsMainMenu;
  let fixture: ComponentFixture<SettingsMainMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsMainMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsMainMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
