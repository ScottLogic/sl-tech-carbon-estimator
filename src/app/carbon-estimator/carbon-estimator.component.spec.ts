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
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeFalsy();
  });

  it('should show form and estimation when showEstimation is true', () => {
    component.showEstimation = true;
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('sl-carbon-estimator-form');
    const estimationElement = fixture.nativeElement.querySelector('sl-carbon-estimation');

    expect(formElement).toBeTruthy();
    expect(estimationElement).toBeTruthy();
  });
});
