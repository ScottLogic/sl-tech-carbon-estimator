import { TestBed } from '@angular/core/testing';
import { OrganisationFormService, defaultValues } from './organisation-form.service';

describe('OrganisationFormService', () => {
  let service: OrganisationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationFormService],
    });
    service = TestBed.inject(OrganisationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize form with default values', () => {
      expect(service.form.get('headCount')?.value).toBe(defaultValues.headCount);
      expect(service.form.get('desktopPercentage')?.value).toBe(defaultValues.desktopPercentage);
      expect(service.form.get('employeeLocation')?.value).toBe(defaultValues.employeeLocation);
    });
  });

  describe('form validation', () => {
    it('should have min validator of 1 on headCount', () => {
      const headCountControl = service.form.get('headCount');
      headCountControl?.setValue(0);
      expect(headCountControl?.hasError('min')).toBeTruthy();
    });

    it('should accept valid headCount values', () => {
      const headCountControl = service.form.get('headCount');
      headCountControl?.setValue(50);
      expect(headCountControl?.valid).toBeTruthy();
    });
  });
});
