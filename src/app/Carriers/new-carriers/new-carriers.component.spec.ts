import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarriersComponent } from './new-carriers.component';

describe('NewCarriersComponent', () => {
  let component: NewCarriersComponent;
  let fixture: ComponentFixture<NewCarriersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarriersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
