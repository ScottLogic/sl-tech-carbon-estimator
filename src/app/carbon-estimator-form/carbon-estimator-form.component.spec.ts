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
        { provide: CO2_CALCULATOR, useFactory: () => new FakeCO2Calculator('object') },
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
});
