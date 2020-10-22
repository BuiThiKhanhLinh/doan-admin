import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaivietComponent } from './baiviet.component';

describe('BaivietComponent', () => {
  let component: BaivietComponent;
  let fixture: ComponentFixture<BaivietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaivietComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaivietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
