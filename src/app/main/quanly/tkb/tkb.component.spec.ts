import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TkbComponent } from './tkb.component';

describe('TkbComponent', () => {
  let component: TkbComponent;
  let fixture: ComponentFixture<TkbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TkbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TkbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
