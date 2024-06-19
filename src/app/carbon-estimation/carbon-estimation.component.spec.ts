import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationComponent } from './carbon-estimation.component';
import { CarbonEstimation } from '../types/carbon-estimator';
import { ChartComponent } from 'ng-apexcharts';
import { sumValues } from '../utils/number-object';
import { estimatorHeights } from './carbon-estimation.constants';

describe('CarbonEstimationComponent', () => {
  let component: CarbonEstimationComponent;
  let fixture: ComponentFixture<CarbonEstimationComponent>;
  const estimatorBaseHeight = sumValues(estimatorHeights);

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

  it('should set chart height when inner height is more than base height', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.chartOptions.chart.height).toBe(600 - estimatorBaseHeight - 200);
  });

  it('should set chart height to value if inner height more than base height plus extra height', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);
    fixture.componentRef.setInput('extraHeight', '100');
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.chartOptions.chart.height).toBe(600 - estimatorBaseHeight - 200 - 100);
  });

  [0.5, 1, 2, 5].forEach(browserZoomFactor => {
    it(`should recalculate chart height on window resize, for laptop screen (zoom factor: ${browserZoomFactor})`, () => {
      spyOn(component.chart as ChartComponent, 'updateOptions');
      spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

      component.onResize(1500, 1000, 2000, browserZoomFactor);

      expect(component.chart?.updateOptions).toHaveBeenCalledOnceWith({
        chart: { height: (1500 - estimatorBaseHeight - 200) * browserZoomFactor },
      });
    });
  });

  [0.5, 1, 2, 5].forEach(browserZoomFactor => {
    it(`should recalculate chart height on window resize, for mobile screen (zoom factor: ${browserZoomFactor})`, () => {
      spyOn(component.chart as ChartComponent, 'updateOptions');
      spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

      component.onResize(1000, 500, 1000, browserZoomFactor);

      expect(component.chart?.updateOptions).toHaveBeenCalledOnceWith({
        chart: { height: (1000 - estimatorBaseHeight - 200 + estimatorHeights.title) * browserZoomFactor },
      });
    });
  });

  it('should cap chart height as a percentage of screen height for laptop screen', () => {
    spyOn(component.chart as ChartComponent, 'updateOptions');
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    const screenHeight = 2000;
    component.onResize(2000, 1000, screenHeight, 1);

    expect(component.chart?.updateOptions).toHaveBeenCalledOnceWith({
      chart: { height: screenHeight * 0.75 },
    });
  });

  it('should cap chart height as a percentage of screen height for mobile screen', () => {
    spyOn(component.chart as ChartComponent, 'updateOptions');
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    const screenHeight = 1000;
    component.onResize(1100, 500, screenHeight, 1);

    expect(component.chart?.updateOptions).toHaveBeenCalledOnceWith({
      chart: { height: screenHeight * 0.75 },
    });
  });

  it('should call onResize when onExpansion is called', () => {
    spyOn(component, 'onResize');

    component.onExpanded();

    expect(component.onResize).toHaveBeenCalledTimes(1);
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
            x: 'Software - Off the Shelf',
            y: 7,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions' },
          },
          {
            x: 'Employee Hardware',
            y: 6,
            meta: { svg: 'devices-logo', parent: 'Upstream Emissions' },
          },
          {
            x: 'Networking and Infrastructure Hardware',
            y: 6,
            meta: { svg: 'router-logo', parent: 'Upstream Emissions' },
          },
          {
            x: 'Servers and Storage Hardware',
            y: 6,
            meta: { svg: 'storage-logo', parent: 'Upstream Emissions' },
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
            meta: { svg: 'devices-logo', parent: 'Direct Emissions' },
          },
          {
            x: 'Networking and Infrastructure',
            y: 8,
            meta: { svg: 'router-logo', parent: 'Direct Emissions' },
          },
          {
            x: 'Servers and Storage',
            y: 8,
            meta: { svg: 'storage-logo', parent: 'Direct Emissions' },
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
            meta: { svg: 'cloud-logo', parent: 'Indirect Emissions' },
          },
          {
            x: 'SaaS',
            y: 8,
            meta: { svg: 'web-logo', parent: 'Indirect Emissions' },
          },
          {
            x: 'Managed Services',
            y: 8,
            meta: { svg: 'storage-logo', parent: 'Indirect Emissions' },
          },
        ],
      },
      {
        name: 'Downstream Emissions - 25%',
        color: '#4B7E56',
        data: [
          {
            x: 'End-User Devices',
            y: 13,
            meta: { svg: 'devices-logo', parent: 'Downstream Emissions' },
          },
          {
            x: 'Network Data Transfer',
            y: 12,
            meta: { svg: 'cell-tower-logo', parent: 'Downstream Emissions' },
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
        employee: 0.1,
        network: 0.1,
        server: 0.1,
      },
      directEmissions: {
        employee: 34.5,
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

    expect(component.emissions[0].name).toBe('Upstream Emissions - <1%');
  });

  it('should remove categories when they are 0', () => {
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 25,
        employee: 0,
        network: 0,
        server: 0,
      },
      directEmissions: {
        employee: 25,
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
        networkTransfer: 0,
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
            x: 'Software - Off the Shelf',
            y: 25,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions' },
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
            meta: { svg: 'devices-logo', parent: 'Direct Emissions' },
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
            meta: { svg: 'cloud-logo', parent: 'Indirect Emissions' },
          },
        ],
      },
      {
        name: 'Downstream Emissions - 25%',
        color: '#4B7E56',
        data: [
          {
            x: 'End-User Devices',
            y: 25,
            meta: { svg: 'devices-logo', parent: 'Downstream Emissions' },
          },
        ],
      },
    ];

    expect(component.emissions).toEqual(expectedEmissions);
  });

  it('should remove parent categories when all values are 0', () => {
    const carbonEstimation: CarbonEstimation = {
      version: '1.0',
      upstreamEmissions: {
        software: 50,
        employee: 0,
        network: 0,
        server: 0,
      },
      directEmissions: {
        employee: 50,
        network: 0,
        server: 0,
      },
      indirectEmissions: {
        cloud: 0,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        endUser: 0,
        networkTransfer: 0,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();

    const expectedEmissions = [
      {
        name: 'Upstream Emissions - 50%',
        color: '#40798C',
        data: [
          {
            x: 'Software - Off the Shelf',
            y: 50,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions' },
          },
        ],
      },
      {
        name: 'Direct Emissions - 50%',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 50,
            meta: { svg: 'devices-logo', parent: 'Direct Emissions' },
          },
        ],
      },
    ];

    expect(component.emissions).toEqual(expectedEmissions);
  });
});
