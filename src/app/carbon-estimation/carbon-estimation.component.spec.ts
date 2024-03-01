import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationComponent } from './carbon-estimation.component';

describe('CarbonEstimationComponent', () => {
  let component: CarbonEstimationComponent;
  let fixture: ComponentFixture<CarbonEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarbonEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
