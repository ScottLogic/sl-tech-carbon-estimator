import { TestBed } from '@angular/core/testing';

import { CarbonEstimationService } from './carbon-estimation.service';
import { CarbonEstimation, EstimatorValues } from '../carbon-estimator';
import { LoggingService } from './logging.service';

function checkTotalPercentage(estimation: CarbonEstimation) {
  expect(estimation.upstreamEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.directEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.cloudEmissions).toBeGreaterThanOrEqual(0);
  expect(estimation.downstreamEmissions).toBeGreaterThanOrEqual(0);
  const total =
    estimation.upstreamEmissions +
    estimation.directEmissions +
    estimation.cloudEmissions +
    estimation.downstreamEmissions;
  expect(total).toBeCloseTo(100);
}

describe('CarbonEstimationService', () => {
  let service: CarbonEstimationService;
  let loggingService: jasmine.SpyObj<LoggingService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoggingService', ['log']);
    TestBed.configureTestingModule({
      providers: [CarbonEstimationService, { provide: LoggingService, useValue: spy }],
    });
    service = TestBed.inject(CarbonEstimationService);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include version and zeroed values in estimation', () => {
    const estimation = service.calculateCarbonEstimation({} as EstimatorValues);
    expect(estimation.version).toBe('0.0.1');
    expect(estimation.upstreamEmissions).toBe(0);
    expect(estimation.directEmissions).toBe(0);
    expect(estimation.cloudEmissions).toBe(0);
    expect(estimation.downstreamEmissions).toBe(0);
  });

  it('should calculate estimations as percentages', () => {
    const estimation = service.calculateCarbonEstimation({
      upstream: {
        headCount: 1,
        desktopPercentage: 0,
      },
    } as EstimatorValues);
    checkTotalPercentage(estimation);
  });

  it('should deal with NaN for server count', () => {
    const estimation = service.calculateCarbonEstimation({
      upstream: {
        headCount: 1,
        desktopPercentage: 0,
      },
      onPremise: {
        serverLocation: 'global',
        numberOfServers: NaN,
      },
    } as EstimatorValues);
    checkTotalPercentage(estimation);
  });

  it('should log intermediate results', () => {
    service.calculateCarbonEstimation({} as EstimatorValues);
    expect(loggingService.log).toHaveBeenCalledWith('Estimated Device Counts:', jasmine.any(Object));
    expect(loggingService.log).toHaveBeenCalledWith(
      jasmine.stringMatching(/^Estimated Upstream Emissions: \d*\.?\d*kg CO2e$/)
    );
    expect(loggingService.log).toHaveBeenCalledWith(
      jasmine.stringMatching(/^Estimated Direct Emissions: \d*\.?\d*kg CO2e$/)
    );
    expect(loggingService.log).toHaveBeenCalledWith(
      jasmine.stringMatching(/^Estimated Cloud Emissions: \d*\.?\d*kg CO2e$/)
    );
    expect(loggingService.log).toHaveBeenCalledWith(
      jasmine.stringMatching(/^Estimated Downstream Emissions: \d*\.?\d*kg CO2e$/)
    );
  });
});
