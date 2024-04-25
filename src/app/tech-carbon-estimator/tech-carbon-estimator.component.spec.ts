import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechCarbonEstimatorComponent } from './tech-carbon-estimator.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { EstimatorValues } from '../types/carbon-estimator';

describe('TechCarbonEstimatorComponent', () => {
  let component: TechCarbonEstimatorComponent;
  let fixture: ComponentFixture<TechCarbonEstimatorComponent>;
  let estimationServiceStub: Partial<CarbonEstimationService>;

  beforeEach(async () => {
    estimationServiceStub = {
      calculateCarbonEstimation: () => ({
        version: '0.0.0',
        upstreamEmissions: {
          software: 0,
          user: 10,
          network: 10,
          server: 5,
        },
        indirectEmissions: {
          saas: 0,
          managed: 0,
          cloud: 25,
        },
        directEmissions: {
          user: 10,
          network: 10,
          server: 5,
        },
        downstreamEmissions: {
          endUser: 15,
          networkTransfer: 10,
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TechCarbonEstimatorComponent],
      providers: [{ provide: CarbonEstimationService, useValue: estimationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(TechCarbonEstimatorComponent);
    component = fixture.componentInstance;
  });

  it('should only show form when showEstimation is false', () => {
    component.showEstimation = false;
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeFalsy();
  });

  it('should show form and estimation when showEstimation is true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeTruthy();
  });

  it('should show assumptions and estimations when showEstimation and showAssumptionsAndLimitationView are true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('carbon-estimation');
    const assumptionsElement = fixture.nativeElement.querySelector('assumptions-and-limitation');

    expect(formElement).toBeFalsy();
    expect(estimationElement).toBeTruthy();
    expect(assumptionsElement).toBeTruthy();
  });

  it('should call estimationService.calculateCarbonEstimation when handleFormSubmit is called', () => {
    spyOn(estimationServiceStub, 'calculateCarbonEstimation' as never).and.callThrough();

    // The form component expects a full EstimatorValues object or undefined, but we only need to test that the service is called
    const formValue = undefined as unknown as EstimatorValues;
    component.handleFormSubmit(formValue);
    expect(estimationServiceStub.calculateCarbonEstimation).toHaveBeenCalledWith(formValue);
    expect(component.showEstimation).toBeTrue();
  });

  it('should scroll to top of assumptions and limitation when showAssumptionsAndLimitation is called', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();
    spyOn(component.assumptionsLimitation.nativeElement, 'scrollIntoView').and.callThrough();
    component.showAssumptionsAndLimitation();
    fixture.detectChanges();

    expect(component.assumptionsLimitation.nativeElement.scrollIntoView).toHaveBeenCalled();
  });

  it('should scroll to top of estimations when closeAssumptionsAndLimitation is called', () => {
    component.showEstimation = true;
    // Setting to true so the component exists, the detectChanges on line 48 doesn't not seem to result in the component being created as is normal when running the app
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    spyOn(component.estimations.nativeElement, 'scrollIntoView').and.callThrough();

    component.closeAssumptionsAndLimitation(false);
    fixture.detectChanges();

    expect(component.estimations.nativeElement.scrollIntoView).toHaveBeenCalled();
  });

  it('should focus on assumptions button when closeAssumptionsAndLimitation is called with hasFocus true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    component.closeAssumptionsAndLimitation(true);
    fixture.detectChanges();

    const button = fixture.nativeElement
      .querySelector('button#showAssumptionsAndLimitationButton')
      ?.contains(document.activeElement);
    expect(button).toBeTrue();
  });
});
