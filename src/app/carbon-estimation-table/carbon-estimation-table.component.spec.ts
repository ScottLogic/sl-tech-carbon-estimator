import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationTableComponent } from './carbon-estimation-table.component';
import { CarbonEstimationUtilService } from '../services/carbon-estimation-util.service';
import { CarbonEstimation } from '../types/carbon-estimator';

describe('CarbonEstimationTableComponent', () => {
  let component: CarbonEstimationTableComponent;
  let fixture: ComponentFixture<CarbonEstimationTableComponent>;
  const utilSpy = jasmine.createSpyObj('CarbonEstimationUtilService', [
    'getOverallPercentageLabel, getPercentageLabel, getLabelAndSvg',
  ]);

  utilSpy.getOverallPercentageLabel.and.returnValue('7%');
  utilSpy.getPercentageLabel.and.returnValue('7%');
  utilSpy.getLabelAndSvg.and.returnValue({ label: 'Emissions', svg: 'svg' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationTableComponent],
      providers: [{ provide: CarbonEstimationUtilService, useValue: utilSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimationTableComponent);
    component = fixture.componentInstance;
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 7,
        employee: 6,
        network: 6,
        server: 6,
      },
      directEmissions: {
        employee: 9,
        network: 8,
        server: 8,
      },
      indirectEmissions: {
        cloud: 9,
        saas: 8,
        managed: 8,
      },
      downstreamEmissions: {
        endUser: 13,
        networkTransfer: 12,
      },
    };

    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);
    fixture.detectChanges();
  });

  it('should toggle display value of child emissions when toggle called', () => {
    component.toggle('Upstream');
    expect(component.emissions[0].display).toBeFalse();
    component.emissions.forEach(emission => {
      if (emission.parent === 'Upstream') {
        expect(emission.display).toBeFalse();
      }
    });
  });

  it('should set child emissions to display by default', () => {
    component.emissions.forEach(emission => {
      if (emission.parent) {
        expect(emission.display).toBeFalse();
      }
    });
  });

  it('should get emissions when getEmissions called', () => {
    const emissions = component.getEmissions(component.carbonEstimation());
    expect(emissions.length).toBe(13);
  });
});
