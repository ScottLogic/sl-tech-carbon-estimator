import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechCarbonEstimatorComponent } from './tech-carbon-estimator.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { CarbonEstimation, EstimatorValues } from '../types/carbon-estimator';
import { By } from '@angular/platform-browser';

const getMockCarbonEstimation: () => CarbonEstimation = () => ({
  version: '0.0.0',
  upstreamEmissions: {
    software: 0,
    employee: 10,
    network: 10,
    server: 5,
  },
  indirectEmissions: {
    saas: 0,
    managed: 0,
    cloud: 25,
  },
  directEmissions: {
    employee: 10,
    network: 10,
    server: 5,
  },
  downstreamEmissions: {
    endUser: 15,
    networkTransfer: 10,
  },
});

describe('TechCarbonEstimatorComponent', () => {
  let component: TechCarbonEstimatorComponent;
  let fixture: ComponentFixture<TechCarbonEstimatorComponent>;
  let estimationServiceStub: Partial<CarbonEstimationService>;

  beforeEach(async () => {
    estimationServiceStub = {
      calculateCarbonEstimation: getMockCarbonEstimation,
    };

    await TestBed.configureTestingModule({
      imports: [TechCarbonEstimatorComponent],
      providers: [{ provide: CarbonEstimationService, useValue: estimationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(TechCarbonEstimatorComponent);
    component = fixture.componentInstance;
  });

  it('should show the form when showAssumptionsAndLimitationsView is false', () => {
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('carbon-estimator-form');
    const assumptionsElement = fixture.nativeElement.querySelector('assumptions-and-limitation');

    expect(formElement).toBeTruthy();
    expect(assumptionsElement).toBeFalsy();
  });

  it('should show the assumptions and limitations when showAssumptionsAndLimitationsView is true', () => {
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('carbon-estimator-form');
    const assumptionsElement = fixture.nativeElement.querySelector('assumptions-and-limitation');

    expect(formElement).toBeFalsy();
    expect(assumptionsElement).toBeTruthy();
  });

  it('should call estimationService.calculateCarbonEstimation when handleFormSubmit is called', () => {
    spyOn(estimationServiceStub, 'calculateCarbonEstimation' as never).and.callThrough();

    // The form component expects a full EstimatorValues object or undefined, but we only need to test that the service is called
    const formValue = undefined as unknown as EstimatorValues;
    component.handleFormSubmit(formValue);

    expect(estimationServiceStub.calculateCarbonEstimation).toHaveBeenCalledWith(formValue);
  });

  it('should set the carbonEstimation when handleFormSubmit is called', () => {
    component.carbonEstimation = null;
    fixture.detectChanges();

    const formValue = undefined as unknown as EstimatorValues;
    component.handleFormSubmit(formValue);

    expect(component.carbonEstimation as CarbonEstimation | null).toEqual(getMockCarbonEstimation());
  });

  it('should set the carbonEstimation to null when the form is reset', () => {
    component.carbonEstimation = getMockCarbonEstimation();
    fixture.detectChanges();

    fixture.debugElement.query(By.css('carbon-estimator-form')).triggerEventHandler('formReset');

    expect(component.carbonEstimation).toBeNull();
  });

  it('should focus on assumptions button when closeAssumptionsAndLimitation is called with hasFocus true', () => {
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    component.closeAssumptionsAndLimitation(true);
    fixture.detectChanges();

    const button = component.showAssumptionsLimitationButton.nativeElement;
    expect(document.activeElement).toEqual(button);
    expect(button);
  });
});
