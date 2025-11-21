import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationComponent } from './carbon-estimation.component';
import { CarbonEstimation } from '../types/carbon-estimator';

const defaultAIInferenceEmissions = { aiInference: 0 };
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
      percentages: {
        version: '1.0',
        upstreamEmissions: {
          software: 7,
          employee: 6,
          network: 6,
          server: 6,
          foundationModels: 0,
          contentAndData: 0,
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
        aiInferenceEmissions: defaultAIInferenceEmissions, downstreamEmissions: {
          endUser: 13,
          networkTransfer: 12,
          downstreamInfrastructure: 0,
        },
      },
      values: {
        version: '1.0',
        upstreamEmissions: {
          software: 700,
          employee: 600,
          network: 600,
          server: 600,
          foundationModels: 0,
          contentAndData: 0,
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
        aiInferenceEmissions: defaultAIInferenceEmissions, downstreamEmissions: {
          endUser: 1300,
          networkTransfer: 1200,
          downstreamInfrastructure: 0
        }, totalEmissions: 7000,
      },
    };

    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();
  });

  it('should set the chart height when the component is rendered', () => {
    // Check that the height is set to a positive value.
    // (Checking for a specific value would require spying on the window object before
    // the test starts for consistent local and CI/CD results.)
    expect(component.chartHeight).toBeGreaterThan(0);
  });

  it('should subtract the extraHeight input from the chart height on laptop screens', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);
    fixture.componentRef.setInput('extraHeight', '100');

    component.onResize(1500, 1500, 2000);

    expect(component.chartHeight).toBe(1500 - estimatorBaseHeight - 200 - 100);
  });

  it('should recalculate chart height on window resize, for laptop screen', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    component.onResize(1500, 2000, 2000);

    expect(component.chartHeight).toBe(1500 - estimatorBaseHeight - 200);
  });

  it('should recalculate chart height on window resize, for mobile screen', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    component.onResize(1000, 500, 1000);

    expect(component.chartHeight).toBe(1000 - estimatorBaseHeight - 200 + estimatorHeights.title);
  });

  it('should cap chart height as a percentage of screen height, for laptop screen', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    const screenHeight = 2000;
    component.onResize(2000, 1500, screenHeight);

    expect(component.chartHeight).toBe(screenHeight * 0.75);
  });

  it('should cap chart height as a percentage of screen height, for mobile screen', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    const screenHeight = 1200;
    component.onResize(1200, 500, screenHeight);

    expect(component.chartHeight).toBe(screenHeight * 0.75);
  });

  it('should have a chart height of 300 for small innerHeight values (if screen height is large enough)', () => {
    spyOnProperty(component.detailsPanel.nativeElement, 'clientHeight').and.returnValue(200);

    component.onResize(100, 1000, 2000);

    expect(component.chartHeight).toBe(300);
  });

  it('should call onResize when onExpansion is called', () => {
    spyOn(component, 'onResize');

    component.onExpanded();

    expect(component.onResize).toHaveBeenCalledTimes(1);
  });

  it('should disable the export button if there is no carbon estimation', () => {
    fixture.componentRef.setInput('carbonEstimation', undefined);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    const exportButton = Array.from(buttons).find(button => button.classList.contains('tce-export-button'));

    console.log('Export button:', exportButton);

    expect(exportButton?.disabled).toBeTrue();
  });

  it('should enable the export button if there is a carbon estimation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    const exportButton = Array.from(buttons).find(button => button.classList.contains('tce-export-button'));

    expect(exportButton?.disabled).toBeFalse();
  });

  it('should default to annual and use the annual estimate for estimate()', () => {
    expect(component.isAnnual()).toBeTrue();
    expect(component.estimate()).toBe(component.carbonEstimation());
  });

  it('should return a monthly estimate (annual ÷ 12) when switched to monthly', () => {
    component.isAnnual.set(false);
    fixture.detectChanges();

    const monthly = component.estimate();
    expect(monthly).toBeTruthy();

    expect(monthly!.values.totalEmissions).toBeCloseTo(7000 / 12);

    expect(monthly!.values.upstreamEmissions.software).toBeCloseTo(700 / 12);

    expect(component.carbonEstimation()!.values.totalEmissions).toBe(7000);
  });

  it('should update the active label classes in the DOM when switching', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const labels = Array.from(compiled.querySelectorAll('.tce-switch-label')) as HTMLElement[];
    expect(labels.length).toBeGreaterThanOrEqual(2);

    expect(labels[0].classList.contains('tce-switch-active')).toBeTrue();
    expect(labels[1].classList.contains('tce-switch-active')).toBeFalse();

    component.isAnnual.set(false);
    fixture.detectChanges();

    expect(labels[0].classList.contains('tce-switch-active')).toBeFalse();
    expect(labels[1].classList.contains('tce-switch-active')).toBeTrue();
  });
});
