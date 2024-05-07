import { TestBed } from '@angular/core/testing';

import { CarbonEstimationService } from './carbon-estimation.service';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { LoggingService } from './logging.service';
import { NumberObject, sumValues } from '../utils/number-object';
import { version } from '../../../package.json';

const emptyEstimatorValues: EstimatorValues = {
  upstream: {
    headCount: 0,
    desktopPercentage: 0,
    employeeLocation: 'global',
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
    monthlyCloudBill: { min: 0, max: 200 },
  },
  downstream: {
    noDownstream: true,
    customerLocation: 'global',
    monthlyActiveUsers: 0,
    mobilePercentage: 0,
    purposeOfSite: 'streaming',
  },
};

function checkTotalPercentage(estimation: CarbonEstimation) {
  expect(sumValues(estimation.upstreamEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.directEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.indirectEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.downstreamEmissions)).toBeGreaterThanOrEqual(0);
  const total =
    sumValues(estimation.upstreamEmissions) +
    sumValues(estimation.directEmissions) +
    sumValues(estimation.indirectEmissions) +
    sumValues(estimation.downstreamEmissions);
  expect(total).toBeCloseTo(100);
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function expectPartialNumberCloseTo(actual: NumberObject, expected: NumberObject, context: string) {
  for (const [key, value] of Object.entries(expected)) {
    expect(actual[key]).withContext(`${context}.${key}`).toBeCloseTo(value);
  }
}

function expectPartialEstimationCloseTo(actual: CarbonEstimation, expected: RecursivePartial<CarbonEstimation>) {
  for (const [key, value] of Object.entries(expected)) {
    const trueKey = key as keyof CarbonEstimation;
    if (trueKey === 'version' || typeof value === 'string') {
      expect(actual[trueKey]).toBe(value as string);
      continue;
    }
    expectPartialNumberCloseTo(actual[trueKey], value, key);
  }
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
      expect(estimation.version).toBe(version);
      expect(sumValues(estimation.upstreamEmissions)).toBe(0);
      expect(sumValues(estimation.directEmissions)).toBe(0);
      expect(sumValues(estimation.indirectEmissions)).toBe(0);
      expect(sumValues(estimation.downstreamEmissions)).toBe(0);
    });

    it('should calculate estimations as percentages', () => {
      const estimation = service.calculateCarbonEstimation({
        ...emptyEstimatorValues,
        upstream: {
          headCount: 1,
          desktopPercentage: 0,
          employeeLocation: 'global',
        },
      });
      checkTotalPercentage(estimation);
    });

    it('should log intermediate results', () => {
      service.calculateCarbonEstimation(emptyEstimatorValues);
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Input Values: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Device Counts: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Upstream Emissions: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Direct Emissions: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Indirect Emissions: .*/));
      expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/^Estimated Downstream Emissions: .*/));
    });

    it('calculates emissions for hardware', () => {
      const hardwareInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 4,
          desktopPercentage: 50,
          employeeLocation: 'global',
        },
        onPremise: {
          estimateServerCount: false,
          serverLocation: 'global',
          numberOfServers: 2,
        },
      };
      const result = service.calculateCarbonEstimation(hardwareInput);
      expectPartialEstimationCloseTo(result, {
        upstreamEmissions: {
          user: 5.84,
          server: 7.72,
          network: 3.46,
        },
        directEmissions: {
          user: 2.88,
          server: 58.25,
          network: 21.84,
        },
      });
    });

    it('calculates emissions for hardware where servers are in different location to employees', () => {
      const hardwareInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 4,
          desktopPercentage: 50,
          employeeLocation: 'uk',
        },
        onPremise: {
          estimateServerCount: false,
          serverLocation: 'global',
          numberOfServers: 2,
        },
      };
      const result = service.calculateCarbonEstimation(hardwareInput);
      expectPartialEstimationCloseTo(result, {
        upstreamEmissions: {
          user: 6.29,
          server: 8.32,
          network: 3.73,
        },
        directEmissions: {
          user: 1.5,
          server: 62.74,
          network: 17.43,
        },
      });
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
          employeeLocation: 'global',
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
          employeeLocation: 'global',
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
          monthlyCloudBill: { min: 0, max: 200 },
        },
      };
      expect(service.estimateServerCount(fiftyPercentCloudInput)).toBe(5);
    });
  });
});
