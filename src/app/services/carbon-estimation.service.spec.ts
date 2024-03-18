import { TestBed } from '@angular/core/testing';

import { CarbonEstimationService } from './carbon-estimation.service';
import { CarbonEstimation, EstimatorValues } from '../carbon-estimator';
import { LoggingService } from './logging.service';

const emptyEstimatorValues: EstimatorValues = {
  upstream: {
    headCount: 0,
    desktopPercentage: 0,
  },
  onPremise: {
    estimateServerCount: false,
    serverLocation: 'global',
    numberOfServers: 0,
  },
  cloud: {
    noCloudServices: true,
    cloudLocation: 'global',
    cloudPercentage: 0,
    monthlyCloudBill: '0-200',
  },
  downstream: {
    customerLocation: 'global',
    monthlyActiveUsers: 0,
    mobilePercentage: 0,
    purposeOfSite: 'streaming',
  },
};

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

  describe('calculateCarbonEstimation', () => {
    it('should include version and zeroed values in estimation', () => {
      const estimation = service.calculateCarbonEstimation(emptyEstimatorValues);
      expect(estimation.version).toBe('0.0.1');
      expect(estimation.upstreamEmissions).toBe(0);
      expect(estimation.directEmissions).toBe(0);
      expect(estimation.cloudEmissions).toBe(0);
      expect(estimation.downstreamEmissions).toBe(0);
    });

    it('should calculate estimations as percentages', () => {
      const estimation = service.calculateCarbonEstimation({
        ...emptyEstimatorValues,
        upstream: {
          headCount: 1,
          desktopPercentage: 0,
        },
      });
      checkTotalPercentage(estimation);
    });

    it('should log intermediate results', () => {
      service.calculateCarbonEstimation(emptyEstimatorValues);
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Input Values: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Device Counts: .*/));
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

  describe('estimateServerCount', () => {
    it('should estimate zero servers for empty input', () => {
      expect(service.estimateServerCount(emptyEstimatorValues)).toBe(0);
    });

    it('should estimate number of servers based on percentage of headcount', () => {
      const zeroCloudInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 100,
          desktopPercentage: 0,
        },
        onPremise: {
          estimateServerCount: true,
          serverLocation: 'global',
          numberOfServers: 0,
        },
      };
      expect(service.estimateServerCount(zeroCloudInput)).toBe(10);
    });

    it('should reduce number of servers estimate based on cloud usage', () => {
      const fiftyPercentCloudInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 100,
          desktopPercentage: 0,
        },
        onPremise: {
          estimateServerCount: true,
          serverLocation: 'global',
          numberOfServers: 0,
        },
        cloud: {
          cloudPercentage: 50,
          noCloudServices: false,
          cloudLocation: 'global',
          monthlyCloudBill: '0-200',
        },
      };
      expect(service.estimateServerCount(fiftyPercentCloudInput)).toBe(5);
    });
  });
});
