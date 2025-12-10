import { TestBed } from '@angular/core/testing';
import { EstimateSaasEmissionsService } from './estimate-saas-emissions.service';
import { Microsoft365Service } from './microsoft365.service';
import { Saas } from '../components/saas.constants';

describe('EstimateSaasEmissionsService', () => {
  let service: EstimateSaasEmissionsService;
  let mockMicrosoft365Service: jasmine.SpyObj<Microsoft365Service>;

  const mockMicrosoft365Values = {
    useMicrosoft365: true,
    organisationUserCount: 100,
  };

  const mockSaasValues: Saas = {
    microsoft365: mockMicrosoft365Values,
  };

  beforeEach(() => {
    mockMicrosoft365Service = jasmine.createSpyObj('Microsoft365Service', ['calculateEmissions']);

    TestBed.configureTestingModule({
      providers: [EstimateSaasEmissionsService, { provide: Microsoft365Service, useValue: mockMicrosoft365Service }],
    });

    service = TestBed.inject(EstimateSaasEmissionsService);
    mockMicrosoft365Service.calculateEmissions.and.returnValue(16.4854);
  });

  describe('estimateEmissions()', () => {
    it('should call microsoft365Service.calculateEmissions with microsoft365 values', () => {
      service.estimateEmissions(mockSaasValues);
      expect(mockMicrosoft365Service.calculateEmissions).toHaveBeenCalledWith(mockMicrosoft365Values);
      expect(mockMicrosoft365Service.calculateEmissions).toHaveBeenCalledTimes(1);
    });

    it('should return the total emissions from saas providers', () => {
      const result = service.estimateEmissions(mockSaasValues);
      expect(result).toBe(16.4854);
    });
  });
});
