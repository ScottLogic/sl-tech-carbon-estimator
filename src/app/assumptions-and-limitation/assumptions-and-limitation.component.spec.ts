import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssumptionsAndLimitationComponent } from './assumptions-and-limitation.component';
import { CarbonIntensityService } from '../services/carbon-intensity.service';
import { WorldLocation } from '../types/carbon-estimator';
import { gCo2ePerKwh } from '../types/units';

const testIntensities: Record<WorldLocation, gCo2ePerKwh> = {
  WORLD: 100,
  GBR: 200,
  EUROPE: 300,
  'NORTH AMERICA': 400,
  ASIA: 500,
  AFRICA: 600,
  OCEANIA: 700,
  'LATIN AMERICA AND CARIBBEAN': 800,
};

describe('AssumptionsAndLimitationComponent', () => {
  let component: AssumptionsAndLimitationComponent;
  let fixture: ComponentFixture<AssumptionsAndLimitationComponent>;
  let intensityServiceStub: CarbonIntensityService;

  beforeEach(async () => {
    intensityServiceStub = {
      getCarbonIntensity: location => testIntensities[location],
    };

    await TestBed.configureTestingModule({
      imports: [AssumptionsAndLimitationComponent],
      providers: [{ provide: CarbonIntensityService, useValue: intensityServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(AssumptionsAndLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should expose carbon intensity values', () => {
    expect(component).toBeTruthy();
    expect(component.locationCarbonInfo).toEqual([
      { location: 'Global', carbonIntensity: 100 },
      { location: 'United Kingdom', carbonIntensity: 200 },
      { location: 'Europe', carbonIntensity: 300 },
      { location: 'North America', carbonIntensity: 400 },
      { location: 'Asia', carbonIntensity: 500 },
      { location: 'Africa', carbonIntensity: 600 },
      { location: 'Oceania', carbonIntensity: 700 },
      { location: 'Latin America and Caribbean', carbonIntensity: 800 },
    ]);
  });
});
