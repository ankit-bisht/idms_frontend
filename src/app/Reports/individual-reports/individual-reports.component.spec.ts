import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualReportsComponent } from './individual-reports.component';

describe('IndividualReportsComponent', () => {
  let component: IndividualReportsComponent;
  let fixture: ComponentFixture<IndividualReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
