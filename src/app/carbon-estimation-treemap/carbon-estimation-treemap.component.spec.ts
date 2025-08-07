import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationTreemapComponent } from './carbon-estimation-treemap.component';
import { CarbonEstimation } from '../types/carbon-estimator';

describe('CarbonEstimationTreemapComponent', () => {
  let component: CarbonEstimationTreemapComponent;
  let fixture: ComponentFixture<CarbonEstimationTreemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationTreemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimationTreemapComponent);
    component = fixture.componentInstance;

    const carbonEstimation: CarbonEstimation = {
      percentages: {
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
        totalEmissions: 70,
      },
      values: {
        version: '1.0',
        upstreamEmissions: {
          software: 700,
          employee: 600,
          network: 600,
          server: 600,
        },
        directEmissions: {
          employee: 900,
          network: 800,
          server: 800,
        },
        indirectEmissions: {
          cloud: 900,
          saas: 800,
          managed: 800,
        },
        downstreamEmissions: {
          endUser: 1300,
          networkTransfer: 1200,
        },
        totalEmissions: 7000,
      },
    };

    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);
    fixture.componentRef.setInput('chartHeight', 700);

    fixture.detectChanges();
  });

  it('should by default set emissions with total kg and category breakdown', () => {
    const expectedEmissions = [
      {
        name: 'Upstream Emissions Estimate - 2500 kg',
        color: '#40798C',
        data: [
          {
            x: 'Software - Off the Shelf',
            y: 700,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions Estimate' },
          },
          {
            x: 'Employee Hardware',
            y: 600,
            meta: { svg: 'devices-logo', parent: 'Upstream Emissions Estimate' },
          },
          {
            x: 'Networking and Infrastructure Hardware',
            y: 600,
            meta: { svg: 'router-logo', parent: 'Upstream Emissions Estimate' },
          },
          {
            x: 'Servers and Storage Hardware',
            y: 600,
            meta: { svg: 'storage-logo', parent: 'Upstream Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Direct Emissions Estimate - 2500 kg',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 900,
            meta: { svg: 'devices-logo', parent: 'Direct Emissions Estimate' },
          },
          {
            x: 'Networking and Infrastructure',
            y: 800,
            meta: { svg: 'router-logo', parent: 'Direct Emissions Estimate' },
          },
          {
            x: 'Servers and Storage',
            y: 800,
            meta: { svg: 'storage-logo', parent: 'Direct Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Indirect Emissions Estimate - 2500 kg',
        color: '#91234C',
        data: [
          {
            x: 'Cloud Services',
            y: 900,
            meta: { svg: 'cloud-logo', parent: 'Indirect Emissions Estimate' },
          },
          {
            x: 'SaaS',
            y: 800,
            meta: { svg: 'web-logo', parent: 'Indirect Emissions Estimate' },
          },
          {
            x: 'Managed Services',
            y: 800,
            meta: { svg: 'storage-logo', parent: 'Indirect Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Downstream Emissions Estimate - 2500 kg',
        color: '#4B7E56',
        data: [
          {
            x: 'End-User Devices',
            y: 1300,
            meta: { svg: 'devices-logo', parent: 'Downstream Emissions Estimate' },
          },
          {
            x: 'Network Data Transfer',
            y: 1200,
            meta: { svg: 'cell-tower-logo', parent: 'Downstream Emissions Estimate' },
          },
        ],
      },
    ];

    expect(component.chartData()).toEqual(expectedEmissions);
  });

  it('should have detailed aria label', () => {
    expect(component.emissionAriaLabel().length).toBeGreaterThan(25);
  });

  it('should set label to <1% if emission is less than 1', () => {
    const carbonEstimation: CarbonEstimation = {
      percentages: {
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
        totalEmissions: 70,
      },
      values: {
        version: '1.0',
        upstreamEmissions: {
          software: 700,
          employee: 600,
          network: 600,
          server: 600,
        },
        directEmissions: {
          employee: 900,
          network: 800,
          server: 800,
        },
        indirectEmissions: {
          cloud: 900,
          saas: 800,
          managed: 800,
        },
        downstreamEmissions: {
          endUser: 1300,
          networkTransfer: 1200,
        },
        totalEmissions: 7000,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    component.toggleMassPercentages(); // Switch to percentages;

    fixture.detectChanges();

    expect(component.chartData()[0].name).toBe('Upstream Emissions Estimate - <1%');
  });

  it('should remove categories when they are 0', () => {
    const carbonEstimation: CarbonEstimation = {
      percentages: {
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
        totalEmissions: 70,
      },
      values: {
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
        totalEmissions: 70,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();

    const expectedEmissions = [
      {
        name: 'Upstream Emissions Estimate - 25 kg',
        color: '#40798C',
        data: [
          {
            x: 'Software - Off the Shelf',
            y: 25,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Direct Emissions Estimate - 25 kg',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 25,
            meta: { svg: 'devices-logo', parent: 'Direct Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Indirect Emissions Estimate - 25 kg',
        color: '#91234C',
        data: [
          {
            x: 'Cloud Services',
            y: 25,
            meta: { svg: 'cloud-logo', parent: 'Indirect Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Downstream Emissions Estimate - 25 kg',
        color: '#4B7E56',
        data: [
          {
            x: 'End-User Devices',
            y: 25,
            meta: { svg: 'devices-logo', parent: 'Downstream Emissions Estimate' },
          },
        ],
      },
    ];

    expect(component.chartData()).toEqual(expectedEmissions);
  });

  it('should remove parent categories when all values are 0', () => {
    const carbonEstimation: CarbonEstimation = {
      percentages: {
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
        totalEmissions: 70,
      },
      values: {
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
        totalEmissions: 70,
      },
    };
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();

    const expectedEmissions = [
      {
        name: 'Upstream Emissions Estimate - 50 kg',
        color: '#40798C',
        data: [
          {
            x: 'Software - Off the Shelf',
            y: 50,
            meta: { svg: 'web-logo', parent: 'Upstream Emissions Estimate' },
          },
        ],
      },
      {
        name: 'Direct Emissions Estimate - 50 kg',
        color: '#CB3775',
        data: [
          {
            x: 'Employee Devices',
            y: 50,
            meta: { svg: 'devices-logo', parent: 'Direct Emissions Estimate' },
          },
        ],
      },
    ];

    expect(component.chartData()).toEqual(expectedEmissions);
  });
});
