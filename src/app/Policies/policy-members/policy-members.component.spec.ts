import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyMembersComponent } from './policy-members.component';

describe('PolicyMembersComponent', () => {
  let component: PolicyMembersComponent;
  let fixture: ComponentFixture<PolicyMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
