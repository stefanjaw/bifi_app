import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scaffold } from './scaffold';

describe('Scaffold', () => {
  let component: Scaffold;
  let fixture: ComponentFixture<Scaffold>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scaffold]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scaffold);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
