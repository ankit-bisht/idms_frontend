import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarrierAgentsComponent } from './new-carrier-agents.component';

describe('NewCarrierAgentsComponent', () => {
  let component: NewCarrierAgentsComponent;
  let fixture: ComponentFixture<NewCarrierAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarrierAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarrierAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
