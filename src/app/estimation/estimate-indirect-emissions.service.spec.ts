import { TestBed } from '@angular/core/testing';
import { EstimatorValues } from '../types/carbon-estimator';
import { EstimateIndirectEmissionsService } from './estimate-indirect-emissions.service';
import { CarbonIntensityService } from '../services/carbon-intensity.service';

let estimator: EstimateIndirectEmissionsService;
let mockCarbonIntensities: jasmine.SpyObj<CarbonIntensityService>;

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

describe('estimateIndirectEmissions()', () => {
  beforeEach(() => {
    mockCarbonIntensities = jasmine.createSpyObj<CarbonIntensityService>('CarbonIntensityService', [
      'getCarbonIntensity',
    ]);
    mockCarbonIntensities.getCarbonIntensity.and.returnValue(500);

    TestBed.configureTestingModule({
      providers: [{ provide: CarbonIntensityService, useValue: mockCarbonIntensities }],
    });

    estimator = TestBed.inject(EstimateIndirectEmissionsService);
  });
  it('should return no emissions if cloud not used', () => {
    const input: EstimatorValues = {
      ...emptyEstimatorValues,
      cloud: {
        noCloudServices: true,
        cloudPercentage: 0,
        monthlyCloudBill: { min: 0, max: 200 },
        cloudLocation: 'WORLD',
      },
    };

    const result = estimator.estimateIndirectEmissions(input);
    expect(result).toEqual({
      cloud: 0,
      saas: 0,
      managed: 0,
    });
  });

  it('should return emissions based on ratio of costs, expanded to a years usage', () => {
    const input: EstimatorValues = {
      ...emptyEstimatorValues,
      cloud: {
        noCloudServices: false,
        cloudPercentage: 50,
        monthlyCloudBill: { min: 0, max: 200 },
        cloudLocation: 'WORLD',
      },
    };

    const result = estimator.estimateIndirectEmissions(input);
    expect(result.cloud).toBeCloseTo(130.13);
    expect(result.saas).toBe(0);
    expect(result.managed).toBe(0);
  });
});
