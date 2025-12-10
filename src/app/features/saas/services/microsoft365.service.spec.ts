import { TestBed } from '@angular/core/testing';
import { Microsoft365Service } from './microsoft365.service';
import { Microsoft365 } from '../components/microsoft365-form/microsoft365.constants';

describe('Microsoft365Service', () => {
  let service: Microsoft365Service;
  const EMISSIONS_KG_PER_USER_PER_YEAR = 1.935;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Microsoft365Service],
    });
    service = TestBed.inject(Microsoft365Service);
  });

  describe('calculateEmissions()', () => {
    it('should return 0 when useMicrosoft365 is false', () => {
      const form: Microsoft365 = {
        useMicrosoft365: false,
        organisationUserCount: 100,
      };
      expect(service.calculateEmissions(form)).toBe(0);
    });

    it('should return 0 when useMicrosoft365 is false and user count is 0', () => {
      const form: Microsoft365 = {
        useMicrosoft365: false,
        organisationUserCount: 0,
      };
      expect(service.calculateEmissions(form)).toBe(0);
    });

    it('should calculate emissions when useMicrosoft365 is true', () => {
      const form: Microsoft365 = {
        useMicrosoft365: true,
        organisationUserCount: 100,
      };
      const expected = 100 * EMISSIONS_KG_PER_USER_PER_YEAR;
      expect(service.calculateEmissions(form)).toBeCloseTo(expected);
    });

    it('should handle single user', () => {
      const form: Microsoft365 = {
        useMicrosoft365: true,
        organisationUserCount: 1,
      };
      expect(service.calculateEmissions(form)).toBeCloseTo(EMISSIONS_KG_PER_USER_PER_YEAR);
    });

    it('should handle large user counts', () => {
      const form: Microsoft365 = {
        useMicrosoft365: true,
        organisationUserCount: 10000,
      };
      const expected = 10000 * EMISSIONS_KG_PER_USER_PER_YEAR;
      expect(service.calculateEmissions(form)).toBeCloseTo(expected);
    });

    it('should return 0 emissions when user count is 0 and useMicrosoft365 is true', () => {
      const form: Microsoft365 = {
        useMicrosoft365: true,
        organisationUserCount: 0,
      };
      expect(service.calculateEmissions(form)).toBe(0);
    });
  });
});
