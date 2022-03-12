import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyReportsComponent } from './policy-reports.component';

describe('PolicyReportsComponent', () => {
  let component: PolicyReportsComponent;
  let fixture: ComponentFixture<PolicyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
