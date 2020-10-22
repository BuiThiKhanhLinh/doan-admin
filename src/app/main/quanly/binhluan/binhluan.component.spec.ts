import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinhluanComponent } from './binhluan.component';

describe('BinhluanComponent', () => {
  let component: BinhluanComponent;
  let fixture: ComponentFixture<BinhluanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinhluanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinhluanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
