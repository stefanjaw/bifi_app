import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRoaster } from './asset-roaster';

describe('AssetRoaster', () => {
  let component: AssetRoaster;
  let fixture: ComponentFixture<AssetRoaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetRoaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetRoaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
