import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbaivietComponent } from './topbaiviet.component';

describe('TopbaivietComponent', () => {
  let component: TopbaivietComponent;
  let fixture: ComponentFixture<TopbaivietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopbaivietComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbaivietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
