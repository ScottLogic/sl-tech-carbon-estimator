import { TestBed } from '@angular/core/testing';
import { CarbonIntensityService } from '../../../services/carbon-intensity.service';
import { EstimateCloudEmissionsService } from './estimate-cloud-emissions.service';
import { Cloud } from './cloud-form.service';

let estimator: EstimateCloudEmissionsService;
let mockCarbonIntensities: jasmine.SpyObj<CarbonIntensityService>;

const defaultCloudValues: Cloud = {
  noCloudServices: false,
  cloudLocation: 'WORLD',
  cloudPercentage: 50,
  monthlyCloudBill: { min: 0, max: 200 },
};

describe('estimateCloudEmissionsService', () => {
  beforeEach(() => {
    mockCarbonIntensities = jasmine.createSpyObj<CarbonIntensityService>('CarbonIntensityService', [
      'getCarbonIntensity',
    ]);
    mockCarbonIntensities.getCarbonIntensity.and.returnValue(500);

    TestBed.configureTestingModule({
      providers: [{ provide: CarbonIntensityService, useValue: mockCarbonIntensities }],
    });

    estimator = TestBed.inject(EstimateCloudEmissionsService);
  });

  it('should return no emissions if cloud not used', () => {
    const input: Cloud = {
      ...defaultCloudValues,
      noCloudServices: true,
    };

    const result = estimator.estimateEmissions(input);
    expect(result).toEqual(0);
  });

  it('should return emissions based on ratio of costs, expanded to a years usage', () => {
    const result = estimator.estimateEmissions(defaultCloudValues);
    expect(result).toBeCloseTo(130.13);
  });
});
