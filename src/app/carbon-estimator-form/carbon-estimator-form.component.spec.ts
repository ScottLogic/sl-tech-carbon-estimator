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

  it('should create component form in a valid state', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.estimatorForm.valid).toBeTruthy();
  });

  it('should emit an event when reset is clicked', () => {
    spyOn(component.formReset, 'emit');

    fixture.nativeElement.querySelector('button.tce-button-reset').click();

    expect(component.formReset.emit).toHaveBeenCalledTimes(1);
  });

  describe('Downstream', () => {
    it('should invalidate form when monthly active users are zero', () => {
      component.ngOnInit();
      component.estimatorForm.get('downstream.monthlyActiveUsers')?.setValue(0);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeFalsy();
    });

    it('should validate form when downstream is excluded and monthly active users are zero', () => {
      component.ngOnInit();
      component.estimatorForm.get('downstream.monthlyActiveUsers')?.setValue(0);
      component.estimatorForm.get('downstream.noDownstream')?.setValue(true);
      fixture.detectChanges();
      expect(component.estimatorForm.valid).toBeTruthy();
    });
  });

  describe('headCount()', () => {
    it('should not return null once the component is initialized', () => {
      component.ngOnInit();
      expect(component.headCount).not.toBe(null);
    });
  });

  describe('monthlyActiveUsers()', () => {
    it('should not return null once the component is initialized', () => {
      component.ngOnInit();
      expect(component.monthlyActiveUsers).not.toBe(null);
    });
  });
});
