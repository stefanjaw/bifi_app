import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLayout } from './table-layout';

describe('TableLayout', () => {
  let component: TableLayout<any>;
  let fixture: ComponentFixture<TableLayout<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TableLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
