import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationComponent } from './carbon-estimation.component';
import { CarbonEstimation } from '../types/carbon-estimator';
import { estimatorBaseHeight } from './carbon-estimation.constants';
import { ChartComponent } from 'ng-apexcharts';

describe('CarbonEstimationComponent', () => {
  let component: CarbonEstimationComponent;
  let fixture: ComponentFixture<CarbonEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimationComponent);
    component = fixture.componentInstance;
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 7,
        user: 6,
        network: 6,
        server: 6,
      },
      directEmissions: {
        user: 9,
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
        network: 12,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();
  });

  it('should set chart height when inner height is more than base height', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.chartOptions.chart.height).toBe(600 - estimatorBaseHeight);
  });

  it('should set chart height to value if inner height more than base height plus extra height', () => {
    fixture.componentRef.setInput('extraHeight', '100');
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.chartOptions.chart.height).toBe(600 - estimatorBaseHeight - 100);
  });

  it('should recalculate chart height on window resize', () => {
    spyOn(component.chart as ChartComponent, 'updateOptions');

    component.onResize(2000);

    expect(component.chart?.updateOptions).toHaveBeenCalledOnceWith({ chart: { height: 2000 - estimatorBaseHeight } });
  });

  it('chart updateOptions should be not be called if inner height less than base height and extra height', () => {
    spyOn(component.chart as ChartComponent, 'updateOptions');

    fixture.componentRef.setInput('extraHeight', '600');
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.chart?.updateOptions).not.toHaveBeenCalled();
  });

  it('should set emissions with total % and category breakdown', () => {
    const expectedEmissions = [
      {
        name: 'Upstream Emissions - 25%',
        color: '#40798C',
        data: [
          {
            x: 'Software',
            y: 7,
          },
          {
            x: 'User',
            y: 6,
          },
          {
            x: 'Network Hardware',
            y: 6,
          },
          {
            x: 'Server Hardware',
            y: 6,
          },
        ],
      },
      {
        name: 'Direct Emissions - 25%',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 9,
          },
          {
            x: 'Network Devices',
            y: 8,
          },
          {
            x: 'Servers and Storage',
            y: 8,
          },
        ],
      },
      {
        name: 'Indirect Emissions - 25%',
        color: '#91234C',
        data: [
          {
            x: 'Cloud Services',
            y: 9,
          },
          {
            x: 'SaaS',
            y: 8,
          },
          {
            x: 'Managed Services',
            y: 8,
          },
        ],
      },
      {
        name: 'Downstream Emissions - 25%',
        color: '#4B7E56',
        data: [
          {
            x: 'End User Devices',
            y: 13,
          },
          {
            x: 'Network Data Transfer',
            y: 12,
          },
        ],
      },
    ];

    expect(component.emissions).toEqual(expectedEmissions);
  });

  it('should have detailed aria label', () => {
    expect(component.emissionAriaLabel.length).toBeGreaterThan(25);
  });

  it('should set label to <1% if emission is less than 1', () => {
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 0.2,
        user: 0.1,
        network: 0.1,
        server: 0.1,
      },
      directEmissions: {
        user: 34.5,
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
        network: 12,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();

    expect(component.emissions[0].name).toBe('Upstream Emissions - <1%');
  });

  it('should remove categories when they are 0', () => {
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 25,
        user: 0,
        network: 0,
        server: 0,
      },
      directEmissions: {
        user: 25,
        network: 0,
        server: 0,
      },
      indirectEmissions: {
        cloud: 25,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        endUser: 25,
        network: 0,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();

    const expectedEmissions = [
      {
        name: 'Upstream Emissions - 25%',
        color: '#40798C',
        data: [
          {
            x: 'Software',
            y: 25,
          },
        ],
      },
      {
        name: 'Direct Emissions - 25%',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 25,
          },
        ],
      },
      {
        name: 'Indirect Emissions - 25%',
        color: '#91234C',
        data: [
          {
            x: 'Cloud Services',
            y: 25,
          },
        ],
      },
      {
        name: 'Downstream Emissions - 25%',
        color: '#4B7E56',
        data: [
          {
            x: 'End User Devices',
            y: 25,
          },
        ],
      },
    ];

    expect(component.emissions).toEqual(expectedEmissions);
  });
});
