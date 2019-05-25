import { TestBed } from '@angular/core/testing';

import { OrgaService } from './orga.service';

describe('OrgaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgaService = TestBed.get(OrgaService);
    expect(service).toBeTruthy();
  });
});
