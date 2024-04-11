import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationComponent } from './carbon-estimation.component';
import { input } from '@angular/core';
import { CarbonEstimation } from '../types/carbon-estimator';

describe('CarbonEstimationComponent', () => {
  let component: CarbonEstimationComponent;
  let fixture: ComponentFixture<CarbonEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimationComponent);
    component = fixture.componentInstance;
    const carbonEstimation = input.required<CarbonEstimation>();
    fixture.componentRef.setInput('carbonEstimation', carbonEstimation);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
