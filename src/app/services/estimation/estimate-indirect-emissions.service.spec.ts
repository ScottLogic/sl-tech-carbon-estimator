import { TestBed } from '@angular/core/testing';
import { EstimatorValues } from '../../types/carbon-estimator';
import { EstimateIndirectEmissionsService } from './estimate-indirect-emissions.service';
import { EstimateCloudEmissionsService } from '../../features/cloud/services/estimate-cloud-emissions.service';
import { EstimateSaasEmissionsService } from '../../features/saas/services/estimate-saas-emissions.service';

let estimator: EstimateIndirectEmissionsService;
let mockCloudEmissions: jasmine.SpyObj<EstimateCloudEmissionsService>;
let mockSaasEmissions: jasmine.SpyObj<EstimateSaasEmissionsService>;

const defaultValues: EstimatorValues = {
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
  saas: {
    microsoft365: {
      useMicrosoft365: false,
      organisationUserCount: 0,
    },
  },
  aiInference: {
    noAiInference: true,
    primaryTaskType: 'text-generation',
    monthlyInferences: 0,
    aiServiceProvider: 'openai',
    aiServiceLocation: 'WORLD',
  },
};

describe('estimateIndirectEmissions()', () => {
  beforeEach(() => {
    mockCloudEmissions = jasmine.createSpyObj<EstimateCloudEmissionsService>('EstimateCloudEmissionsService', [
      'estimateEmissions',
    ]);
    mockCloudEmissions.estimateEmissions.and.returnValue(500);

    mockSaasEmissions = jasmine.createSpyObj<EstimateSaasEmissionsService>('EstimateSaasEmissionsService', [
      'estimateEmissions',
    ]);
    mockSaasEmissions.estimateEmissions.and.returnValue(100);

    TestBed.configureTestingModule({
      providers: [
        { provide: EstimateCloudEmissionsService, useValue: mockCloudEmissions },
        {
          provide: EstimateSaasEmissionsService,
          useValue: mockSaasEmissions,
        },
      ],
    });

    estimator = TestBed.inject(EstimateIndirectEmissionsService);
  });

  it('should return indirect emissions', () => {
    const result = estimator.estimateIndirectEmissions(defaultValues);
    expect(result).toEqual({
      cloud: 500,
      saas: 100,
      managed: 0,
    });
  });
});
