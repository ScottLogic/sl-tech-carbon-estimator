import { TestBed } from '@angular/core/testing';
import { EstimatorValues } from '../types/carbon-estimator';
import { EstimateIndirectEmissionsService } from './estimate-indirect-emissions.service';
import { EstimateCloudEmissionsService } from '../features/cloud/services/estimate-cloud-emissions.service';

let estimator: EstimateIndirectEmissionsService;
let mockCloudEmissions: jasmine.SpyObj<EstimateCloudEmissionsService>;

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
};

describe('estimateIndirectEmissions()', () => {
  beforeEach(() => {
    mockCloudEmissions = jasmine.createSpyObj<EstimateCloudEmissionsService>('EstimateCloudEmissionsService', [
      'estimateEmissions',
    ]);
    mockCloudEmissions.estimateEmissions.and.returnValue(500);

    TestBed.configureTestingModule({
      providers: [{ provide: EstimateCloudEmissionsService, useValue: mockCloudEmissions }],
    });

    estimator = TestBed.inject(EstimateIndirectEmissionsService);
  });

  it('should return cloud emissions', () => {
    const result = estimator.estimateIndirectEmissions(defaultValues);
    expect(result).toEqual({
      cloud: 500,
      saas: 0,
      managed: 0,
    });
  });
});
