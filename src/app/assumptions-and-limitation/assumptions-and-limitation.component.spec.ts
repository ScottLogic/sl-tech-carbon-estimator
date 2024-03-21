import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssumptionsAndLimitationComponent } from './assumptions-and-limitation.component';

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

  it('should emit close event when press esc key function ran', () => {
    spyOn(component.closeEvent, 'emit');

    component.onEscKeydown();

    expect(component.closeEvent.emit).toHaveBeenCalledTimes(1);
  });
});
