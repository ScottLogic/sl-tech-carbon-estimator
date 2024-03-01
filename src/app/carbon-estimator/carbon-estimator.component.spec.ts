import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimatorComponent } from './carbon-estimator.component';

describe('CarbonEstimatorComponent', () => {
  let component: CarbonEstimatorComponent;
  let fixture: ComponentFixture<CarbonEstimatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarbonEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
