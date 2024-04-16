import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssumptionsAndLimitationComponent } from './assumptions-and-limitation.component';
import { By } from '@angular/platform-browser';

describe('AssumptionsAndLimitationComponent', () => {
  let component: AssumptionsAndLimitationComponent;
  let fixture: ComponentFixture<AssumptionsAndLimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssumptionsAndLimitationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssumptionsAndLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit close event when click close button', () => {
    spyOn(component.closeEvent, 'emit');

    fixture.nativeElement.querySelector('button').click();

    expect(component.closeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit close event when press esc key', () => {
    spyOn(component.closeEvent, 'emit');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.closeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should have focus afterContentInit', () => {
    component.ngAfterContentInit();
    fixture.detectChanges();

    const hasFocus = component.assumptionsLimitation.nativeElement.contains(document.activeElement);
    expect(hasFocus).toBeTrue();
  });

  it('should emit close event with true value when press esc key with focus within component', () => {
    spyOn(component.closeEvent, 'emit');

    component.ngAfterContentInit();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.closeEvent.emit).toHaveBeenCalledWith(true);
  });

  it('should emit close event with false value when press esc key with focus not within component', () => {
    spyOn(component.closeEvent, 'emit');

    component.ngAfterContentInit();
    fixture.detectChanges();
    fixture.elementRef.nativeElement.focus();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.closeEvent.emit).toHaveBeenCalledWith(true);
  });
});
