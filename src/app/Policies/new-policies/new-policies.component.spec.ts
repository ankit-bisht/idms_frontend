import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPoliciesComponent } from './new-policies.component';

describe('NewPoliciesComponent', () => {
  let component: NewPoliciesComponent;
  let fixture: ComponentFixture<NewPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
