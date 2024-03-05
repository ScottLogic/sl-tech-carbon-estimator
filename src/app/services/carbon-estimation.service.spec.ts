import { TestBed } from '@angular/core/testing';

import { CarbonEstimationService } from './carbon-estimation.service';
import { CarbonEstimation } from '../carbon-estimator';

function checkTotalPercentage(estimation: CarbonEstimation) {
  expect(estimation.upstreamEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.directEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.cloudEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.downstreamEmissions).toBeGreaterThanOrEqual(0);
  const total = estimation.upstreamEmissions + estimation.directEmissions + estimation.cloudEmissions + estimation.downstreamEmissions;
  expect(total).toBeCloseTo(100);
}

describe('CarbonEstimationService', () => {
  let service: CarbonEstimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonEstimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include version and zeroed values in estimation', () => {
    const estimation = service.calculateCarbonEstimation({})
    expect(estimation.version).toBe('0.0.1');
    expect(estimation.upstreamEmissions).toBe(0);
    expect(estimation.directEmissions).toBe(0);
    expect(estimation.cloudEmissions).toBe(0);
    expect(estimation.downstreamEmissions).toBe(0);
  });

  it('should calculate estimations as percentages', () => {
    const estimation = service.calculateCarbonEstimation({
      upstream: {
        headCount:1,
        desktopToLaptopPercentage: 0,
      }
    });
    checkTotalPercentage(estimation);
  });

  it('should deal with NaN for server count', () => {
    const estimation = service.calculateCarbonEstimation({
      upstream: {
        headCount:1,
        desktopToLaptopPercentage: 0,
      },
      onPrem: {
        location: 'global',
        numberOfServers: NaN,
      }
    });
    checkTotalPercentage(estimation);
  });
});
