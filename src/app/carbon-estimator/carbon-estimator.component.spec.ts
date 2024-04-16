import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimatorComponent } from './carbon-estimator.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';
import { EstimatorValues } from '../types/carbon-estimator';

describe('CarbonEstimatorComponent', () => {
  let component: CarbonEstimatorComponent;
  let fixture: ComponentFixture<CarbonEstimatorComponent>;
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
          network: 10,
        },
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CarbonEstimatorComponent],
      providers: [{ provide: CarbonEstimationService, useValue: estimationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimatorComponent);
    component = fixture.componentInstance;
  });

  it('should only show form when showEstimation is false', () => {
    component.showEstimation = false;
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeFalsy();
  });

  it('should show form and estimation when showEstimation is true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeTruthy();
  });

  it('should show assumptions and estimations when showEstimation and showAssumptionsAndLimitationView are true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');
    const assumptionsElement = fixture.nativeElement.querySelector('sl-assumptions-and-limitation');

    expect(formElement).toBeFalsy();
    expect(estimationElement).toBeTruthy();
    expect(assumptionsElement).toBeTruthy();
  });

  it('should call estimationService.calculateCarbonEstimation when handleFormSubmit is called', () => {
    spyOn(estimationServiceStub, 'calculateCarbonEstimation' as never).and.callThrough();

    const formValue = {} as EstimatorValues;
    component.handleFormSubmit(formValue);
    expect(estimationServiceStub.calculateCarbonEstimation).toHaveBeenCalledWith(formValue);
    expect(component.showEstimation).toBeTrue();
  });

  it('should scroll to top of content when showAssumptionsAndLimitation is called', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = false;
    fixture.detectChanges();
    spyOn(component.content.nativeElement, 'scrollIntoView').and.callThrough();

    component.showAssumptionsAndLimitation();
    fixture.detectChanges();

    expect(component.content.nativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
  });

  it('should scroll to top of content when closeAssumptionsAndLimitation is calleds', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    spyOn(component.content.nativeElement, 'scrollIntoView').and.callThrough();

    component.closeAssumptionsAndLimitation(false);
    fixture.detectChanges();

    expect(component.content.nativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
  });

  it('should focus on assumptions button when closeAssumptionsAndLimitation is called with hasFocus true', () => {
    component.showEstimation = true;
    component.showAssumptionsAndLimitationView = true;
    fixture.detectChanges();

    component.closeAssumptionsAndLimitation(false);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button#showAssumptionsAndLimitationButton:focus');
    expect(button).toBeDefined();
  });
});
