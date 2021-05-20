import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDependentsComponent } from './policy-dependents.component';

describe('PolicyDependentsComponent', () => {
  let component: PolicyDependentsComponent;
  let fixture: ComponentFixture<PolicyDependentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDependentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
