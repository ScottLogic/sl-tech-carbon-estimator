import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimatorComponent } from './carbon-estimator.component';
import { CarbonEstimationService } from '../services/carbon-estimation.service';

describe('CarbonEstimatorComponent', () => {
  let component: CarbonEstimatorComponent;
  let fixture: ComponentFixture<CarbonEstimatorComponent>;
  let estimationServiceStub: Partial<CarbonEstimationService>;

  beforeEach(async () => {
    estimationServiceStub = {
      calculateCarbonEstimation: () => ({
        version: '0.0.0',
        upstreamEmissions: 25,
        cloudEmissions: 25,
        directEmissions: 25,
        downstreamEmissions: 25,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CarbonEstimatorComponent],
      providers: [{ provide: CarbonEstimationService, useValue: estimationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimatorComponent);
    component = fixture.componentInstance;
  });

  it('should default sideBySide to false', () => {
    fixture.detectChanges();
    expect(component.sideBySide).toBe(false);
  });

  it('should set sideBySide to true when set to true', () => {
    fixture.componentRef.setInput('sideBySide', true);
    fixture.detectChanges();
    expect(component.sideBySide).toBe(true);
  });

  it('should only show form when sideBySide is false and view is form', () => {
    fixture.componentRef.setInput('sideBySide', false);
    component.view = 'form';
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeFalsy();
  });

  it('should only show form when sideBySide is true and view is form', () => {
    fixture.componentRef.setInput('sideBySide', true);
    component.view = 'form';
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeFalsy();
  });

  it('should only show estimation when sideBySide is false and view is calculation', () => {
    fixture.componentRef.setInput('sideBySide', false);
    component.view = 'calculation';
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');
    const updateFormElement = fixture.nativeElement.querySelector('#updateForm');

    expect(formElement).toBeFalsy();
    expect(estimationElement).toBeTruthy();
    expect(updateFormElement).toBeTruthy();
  });

  it('should show estimation and form when sideBySide is true and view is calculation', () => {
    fixture.componentRef.setInput('sideBySide', true);
    component.view = 'calculation';
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');
    const updateFormElement = fixture.nativeElement.querySelector('#updateForm');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeTruthy();
    expect(updateFormElement).toBeFalsy();
  });
});
