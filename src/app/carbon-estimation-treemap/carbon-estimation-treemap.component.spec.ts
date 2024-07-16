import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonEstimationTreemapComponent } from './carbon-estimation-treemap.component';

describe('CarbonEstimationTreemapComponent', () => {
  let component: CarbonEstimationTreemapComponent;
  let fixture: ComponentFixture<CarbonEstimationTreemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonEstimationTreemapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarbonEstimationTreemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
