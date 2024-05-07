import { TestBed } from '@angular/core/testing';

import { CarbonIntensityService } from './carbon-intensity.service';

describe('CarbonIntensityService', () => {
  let service: CarbonIntensityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonIntensityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
