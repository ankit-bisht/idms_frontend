import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIndividualComponent } from './new-individual.component';

describe('NewIndividualComponent', () => {
  let component: NewIndividualComponent;
  let fixture: ComponentFixture<NewIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
