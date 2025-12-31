import { TestBed } from '@angular/core/testing';
import { OnPremiseFormService, defaultOnPremValues } from './on-premise-form.service';

describe('OnPremiseFormService', () => {
  let service: OnPremiseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnPremiseFormService],
    });
    service = TestBed.inject(OnPremiseFormService);
  });

  describe('form initialization', () => {
    it('should initialize form with default values', () => {
      expect(service.form.get('estimateServerCount')?.value).toBe(defaultOnPremValues.estimateServerCount);
      expect(service.form.get('serverLocation')?.value).toBe(defaultOnPremValues.serverLocation);
      expect(service.form.get('numberOfServers')?.value).toBe(defaultOnPremValues.numberOfServers);
    });
  });

  describe('form validation', () => {
    describe('numberOfServers field', () => {
      it('should have min validator of 0', () => {
        const numberOfServersControl = service.form.get('numberOfServers');
        numberOfServersControl?.setValue(-1);
        expect(numberOfServersControl?.hasError('min')).toBeTruthy();
        expect(numberOfServersControl?.valid).toBeFalsy();
      });

      it('should accept valid numberOfServers values', () => {
        const numberOfServersControl = service.form.get('numberOfServers');
        numberOfServersControl?.setValue(50);
        expect(numberOfServersControl?.valid).toBeTruthy();
      });

      it('should accept zero as valid numberOfServers', () => {
        const numberOfServersControl = service.form.get('numberOfServers');
        numberOfServersControl?.setValue(0);
        expect(numberOfServersControl?.valid).toBeTruthy();
      });
    });
  });
});
