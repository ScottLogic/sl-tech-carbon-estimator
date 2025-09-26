import { TestBed } from '@angular/core/testing';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { EstimatorValues } from '../types/carbon-estimator';
import { LoggingService } from '../services/logging.service';
import { CarbonIntensityService } from '../services/carbon-intensity.service';
import { DownstreamEmissionsEstimator } from '../estimation/estimate-downstream-emissions';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';

describe('AI Inference Integration', () => {
  let service: CarbonEstimationService;
  let loggingService: jasmine.SpyObj<LoggingService>;
  let carbonIntensityService: jasmine.SpyObj<CarbonIntensityService>;

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

  beforeEach(() => {
    const logSpy = jasmine.createSpyObj('LoggingService', ['log']);
    const intensitySpy = jasmine.createSpyObj('CarbonIntensityService', ['getCarbonIntensity']);
    intensitySpy.getCarbonIntensity.and.returnValue(500);

    TestBed.configureTestingModule({
      providers: [
        CarbonEstimationService,
        DownstreamEmissionsEstimator,
        { provide: LoggingService, useValue: logSpy },
        { provide: CarbonIntensityService, useValue: intensitySpy },
        { provide: CO2_CALCULATOR, useClass: FakeCO2Calculator },
      ],
    });

    service = TestBed.inject(CarbonEstimationService);
    loggingService = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
    carbonIntensityService = TestBed.inject(CarbonIntensityService) as jasmine.SpyObj<CarbonIntensityService>;
  });

  it('should include AI inference emissions in carbon estimation when AI is used', () => {
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

    // Verify AI inference emissions are included
    expect(result.values.aiInferenceEmissions).toBeDefined();
    expect(result.values.aiInferenceEmissions.aiInference).toBeGreaterThan(0);
    expect(result.percentages.aiInferenceEmissions).toBeDefined();
    expect(result.percentages.aiInferenceEmissions.aiInference).toBeGreaterThan(0);

    // Verify total includes AI emissions
    expect(result.values.totalEmissions).toBeGreaterThan(0);

    // Verify logging
    expect(loggingService.log).toHaveBeenCalledWith(jasmine.stringMatching(/AI Inference Emissions/));
  });

  it('should calculate zero AI inference emissions when AI is not used', () => {
    const result = service.calculateCarbonEstimation(emptyEstimatorValues);

    expect(result.values.aiInferenceEmissions).toBeDefined();
    expect(result.values.aiInferenceEmissions.aiInference).toBe(0);
    expect(result.percentages.aiInferenceEmissions).toBeDefined();
    expect(result.percentages.aiInferenceEmissions.aiInference).toBe(0);
  });

  it('should calculate AI inference emissions for different task types', () => {
    const imageClassificationInput: EstimatorValues = {
      ...emptyEstimatorValues,
      aiInference: {
        noAIInference: false,
        primaryTaskType: 'image-classification',
        monthlyInferences: 500,
        aiServiceProvider: 'google',
        aiServiceLocation: 'WORLD',
      },
    };

    const result = service.calculateCarbonEstimation(imageClassificationInput);

    expect(result.values.aiInferenceEmissions.aiInference).toBeGreaterThan(0);
    expect(result.percentages.aiInferenceEmissions.aiInference).toBeGreaterThan(0);
  });
});