import { TestBed } from '@angular/core/testing';

import { IndividualDetailServiceService } from './individual-detail-service.service';

describe('IndividualDetailServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndividualDetailServiceService = TestBed.get(IndividualDetailServiceService);
    expect(service).toBeTruthy();
  });
});
