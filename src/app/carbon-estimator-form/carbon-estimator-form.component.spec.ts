import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarbonEstimatorFormComponent } from './carbon-estimator-form.component';
import { StorageService } from '../services/storage.service';
import { CO2_CALCULATOR } from '../facades/CO2InjectionToken';
import { FakeCO2Calculator } from '../facades/FakeCO2Calculator';

class MockStorageService {
  storage = new Map<string, string>();

  get(key: string): string | null {
    return this.storage.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

describe('CarbonEstimatorFormComponent', () => {
  let component: CarbonEstimatorFormComponent;
  let fixture: ComponentFixture<CarbonEstimatorFormComponent>;
  let storageService: StorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimatorFormComponent],
      providers: [
        { provide: StorageService, useClass: MockStorageService },
        { provide: CO2_CALCULATOR, useFactory: () => new FakeCO2Calculator() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimatorFormComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    fixture.detectChanges();
  });

  it('should create component form in a valid state', () => {
    expect(component).toBeTruthy();
    expect(component.estimatorForm.valid).toBeTruthy();
  });

  it('should emit an event when reset is clicked', () => {
    spyOn(component.formReset, 'emit');

    fixture.nativeElement.querySelector('button.tce-button-reset').click();

    expect(component.formReset.emit).toHaveBeenCalledTimes(1);
  });

  describe('Downstream', () => {
    it('should invalidate form when monthly active users are zero', () => {
      component.estimatorForm.get('downstream.monthlyActiveUsers')?.setValue(0);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeFalsy();
    });

    it('should validate form when downstream is excluded and monthly active users are zero', () => {
      component.estimatorForm.get('downstream.monthlyActiveUsers')?.setValue(0);
      component.estimatorForm.get('downstream.noDownstream')?.setValue(true);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeTruthy();
    });
  });

  describe('headCount()', () => {
    it('should not return null once the component is initialized', () => {
      expect(component.headCount).not.toBeNull();
    });
  });

  describe('numberOfServers()', () => {
    it('should not return null once the component is initialized', () => {
      expect(component.numberOfServers).not.toBeNull();
    });
  });

  describe('monthlyActiveUsers()', () => {
    it('should not return null once the component is initialized', () => {
      expect(component.monthlyActiveUsers).not.toBeNull();
    });
  });

  describe('form state', () => {
    it('should store the form state when the component is destroyed', () => {
      spyOn(storageService, 'set');
      component.ngOnDestroy();

      expect(storageService.set).toHaveBeenCalled();
    });

    it('should store the state when the page visibility changes', () => {
      spyOn(storageService, 'set');
      document.dispatchEvent(new Event('visibilitychange'));

      expect(storageService.set).toHaveBeenCalled();
    });
  });

  describe('AI Inference Form Section', () => {
    it('should include AI inference form group in the form', () => {
      expect(component.estimatorForm.get('aiInference')).toBeTruthy();
    });

    it('should have default AI inference form values', () => {
      const aiInferenceForm = component.estimatorForm.get('aiInference');
      expect(aiInferenceForm?.get('noAIInference')?.value).toBe(false);
      expect(aiInferenceForm?.get('primaryTaskType')?.value).toBe('text-generation');
      expect(aiInferenceForm?.get('monthlyInferences')?.value).toBe(1000);
      expect(aiInferenceForm?.get('aiServiceProvider')?.value).toBe('openai');
      expect(aiInferenceForm?.get('aiServiceLocation')?.value).toBe('WORLD');
    });

    it('should validate form when AI inference is disabled and monthly inferences is zero', () => {
      const aiInferenceForm = component.estimatorForm.get('aiInference');
      aiInferenceForm?.get('noAIInference')?.setValue(true);
      aiInferenceForm?.get('monthlyInferences')?.setValue(0);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeTruthy();
    });

    it('should invalidate form when AI inference is enabled and monthly inferences is zero', () => {
      const aiInferenceForm = component.estimatorForm.get('aiInference');
      aiInferenceForm?.get('noAIInference')?.setValue(false);
      aiInferenceForm?.get('monthlyInferences')?.setValue(0);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeFalsy();
    });

    it('should have noAIInference property that tracks the form state', () => {
      expect(component.noAIInference).toBeDefined();
      expect(typeof component.noAIInference).toBe('boolean');
    });

    it('should emit form values including AI inference data on submit', () => {
      spyOn(component.formSubmit, 'emit');

      // Set up valid form data including AI inference
      component.estimatorForm.patchValue({
        aiInference: {
          noAIInference: false,
          primaryTaskType: 'image-classification',
          monthlyInferences: 5000,
          aiServiceProvider: 'google',
          aiServiceLocation: 'NORTH AMERICA',
        },
      });

      component.handleSubmit();

      expect(component.formSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          aiInference: jasmine.objectContaining({
            noAIInference: false,
            primaryTaskType: 'image-classification',
            monthlyInferences: 5000,
            aiServiceProvider: 'google',
            aiServiceLocation: 'NORTH AMERICA',
          }),
        })
      );
    });
  });
});
