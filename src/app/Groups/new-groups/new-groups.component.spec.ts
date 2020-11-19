import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupsComponent } from './new-groups.component';

describe('NewGroupsComponent', () => {
  let component: NewGroupsComponent;
  let fixture: ComponentFixture<NewGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
