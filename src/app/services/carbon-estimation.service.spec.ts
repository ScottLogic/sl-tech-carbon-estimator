import { TestBed } from '@angular/core/testing';

import { CarbonEstimationService } from './carbon-estimation.service';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { LoggingService } from './logging.service';
import { sumValues } from '../utils/number-object';
import { version } from '../../../package.json';

const emptyEstimatorValues: EstimatorValues = {
  upstream: {
    headCount: 0,
    desktopPercentage: 0,
    employeeLocation: 'WORLD',
  },
  onPremise: {
    estimateServerCount: false,
    serverLocation: 'WORLD',
    numberOfServers: 0,
  },
  cloud: {
    noCloudServices: true,
    cloudLocation: 'WORLD',
    cloudPercentage: 0,
    monthlyCloudBill: { min: 0, max: 200 },
  },
  downstream: {
    noDownstream: true,
    customerLocation: 'WORLD',
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

  describe('calculateCarbonEstimation()', () => {
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
          employeeLocation: 'WORLD',
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
          employeeLocation: 'WORLD',
        },
        onPremise: {
          estimateServerCount: false,
          serverLocation: 'WORLD',
          numberOfServers: 2,
        },
      };
      const result = service.calculateCarbonEstimation(hardwareInput);
      expect(result.upstreamEmissions.user).withContext('upstreamEmissions.user').toBeCloseTo(3.48);
      expect(result.upstreamEmissions.server).withContext('upstreamEmissions.server').toBeCloseTo(8.01);
      expect(result.upstreamEmissions.network).withContext('upstreamEmissions.network').toBeCloseTo(3.59);
      expect(result.directEmissions.user).withContext('directEmissions.user').toBeCloseTo(1.79);
      expect(result.directEmissions.server).withContext('directEmissions.server').toBeCloseTo(60.45);
      expect(result.directEmissions.network).withContext('directEmissions.network').toBeCloseTo(22.67);
    });

    it('calculates emissions for hardware where servers are in different location to employees', () => {
      const hardwareInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 4,
          desktopPercentage: 50,
          employeeLocation: 'GBR',
        },
        onPremise: {
          estimateServerCount: false,
          serverLocation: 'WORLD',
          numberOfServers: 2,
        },
      };
      const result = service.calculateCarbonEstimation(hardwareInput);
      expect(result.upstreamEmissions.user).withContext('upstreamEmissions.user').toBeCloseTo(3.72);
      expect(result.upstreamEmissions.server).withContext('upstreamEmissions.server').toBeCloseTo(8.56);
      expect(result.upstreamEmissions.network).withContext('upstreamEmissions.network').toBeCloseTo(3.84);
      expect(result.directEmissions.user).withContext('directEmissions.user').toBeCloseTo(0.99);
      expect(result.directEmissions.server).withContext('directEmissions.server').toBeCloseTo(64.54);
      expect(result.directEmissions.network).withContext('directEmissions.network').toBeCloseTo(18.37);
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
          employeeLocation: 'WORLD',
        },
        onPremise: {
          estimateServerCount: true,
          serverLocation: 'WORLD',
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
          employeeLocation: 'WORLD',
        },
        onPremise: {
          estimateServerCount: true,
          serverLocation: 'WORLD',
          numberOfServers: 0,
        },
        cloud: {
          cloudPercentage: 50,
          noCloudServices: false,
          cloudLocation: 'WORLD',
          monthlyCloudBill: { min: 0, max: 200 },
        },
      };
      expect(service.estimateServerCount(fiftyPercentCloudInput)).toBe(5);
    });
  });
});
