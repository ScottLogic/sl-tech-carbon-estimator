import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimatorFormComponent } from './carbon-estimator-form.component';

describe('CarbonEstimatorFormComponent', () => {
  let component: CarbonEstimatorFormComponent;
  let fixture: ComponentFixture<CarbonEstimatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimatorFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarbonEstimatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
