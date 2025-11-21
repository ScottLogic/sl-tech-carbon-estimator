import { TestBed } from '@angular/core/testing';
import { CarbonEstimationService } from './carbon-estimation.service';
import {
  CarbonEstimation,
  CarbonEstimationPercentages,
  CarbonEstimationValues,
  EstimatorValues,
  WorldLocation,
} from '../types/carbon-estimator';
import {
  CarbonEstimation,
  CarbonEstimationPercentages,
  CarbonEstimationValues,
  EstimatorValues,
  WorldLocation,
} from '../types/carbon-estimator';
import { LoggingService } from './logging.service';
import { NumberObject, sumValues } from '../utils/number-object';
import { version } from '../../../package.json';
import { CarbonIntensityService } from './carbon-intensity.service';
import { gCo2ePerKwh } from '../types/units';
import { defaultAIInferenceEmissions } from '../test-utils/carbon-estimation-test-helpers';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';

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
  aiInference: {
    noAIInference: true,
    primaryTaskType: 'text-generation',
    monthlyInferences: 0,
    aiServiceProvider: 'openai',
    aiServiceLocation: 'WORLD',
  },
};

function checkTotalPercentage(estimation: CarbonEstimation) {
  expect(sumValues(estimation.percentages.upstreamEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.percentages.directEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.percentages.indirectEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.percentages.aiInferenceEmissions)).toBeGreaterThanOrEqual(0);
  expect(sumValues(estimation.percentages.downstreamEmissions)).toBeGreaterThanOrEqual(0);
  const total =
    sumValues(estimation.percentages.upstreamEmissions) +
    sumValues(estimation.percentages.directEmissions) +
    sumValues(estimation.percentages.indirectEmissions) +
    sumValues(estimation.percentages.aiInferenceEmissions) +
    sumValues(estimation.percentages.downstreamEmissions);

  // If total emissions are 0, percentages will all be 0, totaling 0
  if (estimation.values.totalEmissions === 0) {
    expect(total).toBe(0);
  } else {
    expect(total).toBeCloseTo(100);
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function expectPartialNumberCloseTo(actual: NumberObject, expected: NumberObject, context: string) {
  for (const [key, value] of Object.entries(expected)) {
    expect(actual[key]).withContext(`${context}.${key}`).toBeCloseTo(value);
  }
}

function expectPartialEstimationCloseTo(
  actual: CarbonEstimationPercentages,
  expected: RecursivePartial<CarbonEstimationPercentages>
) {
function expectPartialEstimationCloseTo(
  actual: CarbonEstimationPercentages,
  expected: RecursivePartial<CarbonEstimationPercentages>
) {
  for (const [key, value] of Object.entries(expected)) {
    const trueKey = key as keyof CarbonEstimationPercentages;
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
  let carbonIntensityService: jasmine.SpyObj<CarbonIntensityService>;
  const mockCarbonIntensities: Record<WorldLocation, gCo2ePerKwh> = {
    WORLD: 500,
    GBR: 250,
    EUROPE: 300,
    'NORTH AMERICA': 400,
    ASIA: 600,
    AFRICA: 550,
    OCEANIA: 500,
    'LATIN AMERICA AND CARIBBEAN': 250,
  };

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LoggingService', ['log']);
    const intensitySpy = jasmine.createSpyObj('CarbonIntensityService', ['getCarbonIntensity']);
    TestBed.configureTestingModule({
      providers: [
        CarbonEstimationService,
        { provide: LoggingService, useValue: logSpy },
        { provide: CarbonIntensityService, useValue: intensitySpy },
        { provide: CO2_CALCULATOR, useFactory: () => new FakeCO2Calculator() },
      ],
    });
    service = TestBed.inject(CarbonEstimationService);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
    carbonIntensityService = TestBed.inject(CarbonIntensityService) as jasmine.SpyObj<CarbonIntensityService>;
    carbonIntensityService.getCarbonIntensity.and.callFake(location => mockCarbonIntensities[location]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateCarbonEstimation()', () => {
    it('should include version and zeroed values in estimation', () => {
      const estimation = service.calculateCarbonEstimation(emptyEstimatorValues);
      expect(estimation.percentages.version).toBe(version);
      expect(sumValues(estimation.percentages.upstreamEmissions)).toBe(0);
      expect(sumValues(estimation.percentages.directEmissions)).toBe(0);
      expect(sumValues(estimation.percentages.indirectEmissions)).toBe(0);
      expect(sumValues(estimation.percentages.downstreamEmissions)).toBe(0);
      expect(sumValues(estimation.values.upstreamEmissions)).toBe(0);
      expect(sumValues(estimation.values.directEmissions)).toBe(0);
      expect(sumValues(estimation.values.indirectEmissions)).toBe(0);
      expect(sumValues(estimation.values.downstreamEmissions)).toBe(0);
      expect(estimation.values.totalEmissions).toBe(0);
    });

    it('should calculate percentages', () => {
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

    it('should use service to find relevant carbon intensities', () => {
      const input: EstimatorValues = {
        upstream: {
          employeeLocation: 'GBR',
          headCount: 0,
          desktopPercentage: 0,
        },
        onPremise: {
          serverLocation: 'EUROPE',
          estimateServerCount: false,
          numberOfServers: 0,
        },
        cloud: {
          cloudLocation: 'NORTH AMERICA',
          noCloudServices: false,
          cloudPercentage: 0,
          monthlyCloudBill: {
            min: 0,
            max: 0,
          },
        },
        downstream: {
          customerLocation: 'WORLD',
          noDownstream: false,
          monthlyActiveUsers: 0,
          mobilePercentage: 0,
          purposeOfSite: 'streaming',
        },
        aiInference: {
          noAIInference: true,
          primaryTaskType: 'text-generation',
          monthlyInferences: 0,
          aiServiceProvider: 'openai',
          aiServiceLocation: 'WORLD',
        },
      };
      service.calculateCarbonEstimation(input);
      expect(carbonIntensityService.getCarbonIntensity).toHaveBeenCalledWith('GBR');
      expect(carbonIntensityService.getCarbonIntensity).toHaveBeenCalledWith('EUROPE');
      expect(carbonIntensityService.getCarbonIntensity).toHaveBeenCalledWith('NORTH AMERICA');
      expect(carbonIntensityService.getCarbonIntensity).toHaveBeenCalledWith('WORLD');
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
      expectPartialEstimationCloseTo(result.percentages, {
        upstreamEmissions: {
          employee: 6.53,
          server: 8.64,
          network: 3.87,
        },
        directEmissions: {
          employee: 3.27,
          server: 65.97,
          network: 11.72,
        },
      });
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
      expectPartialEstimationCloseTo(result.percentages, {
        upstreamEmissions: {
          employee: 6.8,
          server: 8.99,
          network: 4.03,
        },
        directEmissions: {
          employee: 1.7,
          server: 68.65,
          network: 9.83,
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

  describe('AI Inference Integration', () => {
    it('should calculate carbon estimation including AI inference emissions when AI is used', () => {
      const withAIInput: EstimatorValues = {
        ...emptyEstimatorValues,
        upstream: {
          headCount: 10,
          desktopPercentage: 50,
          employeeLocation: 'WORLD',
        },
        aiInference: {
          noAIInference: false,
          primaryTaskType: 'text-generation',
          monthlyInferences: 1000,
          aiServiceProvider: 'openai',
          aiServiceLocation: 'WORLD',
        },
      };

      const result = service.calculateCarbonEstimation(withAIInput);

      expect(result.values.aiInferenceEmissions).toBeDefined();
      expect(result.values.aiInferenceEmissions.aiInference).toBeGreaterThan(0);
      expect(result.percentages.aiInferenceEmissions).toBeDefined();
      expect(result.percentages.aiInferenceEmissions.aiInference).toBeGreaterThan(0);
      checkTotalPercentage(result);
    });

    it('should calculate zero AI inference emissions when AI is not used', () => {
      const result = service.calculateCarbonEstimation(emptyEstimatorValues);

      expect(result.values.aiInferenceEmissions).toBeDefined();
      expect(result.values.aiInferenceEmissions.aiInference).toBe(0);
      expect(result.percentages.aiInferenceEmissions).toBeDefined();
      expect(result.percentages.aiInferenceEmissions.aiInference).toBe(0);
      checkTotalPercentage(result);
    });
  });
});
