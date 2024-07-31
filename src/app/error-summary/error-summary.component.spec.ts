import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSummaryComponent } from './error-summary.component';
import { ValidationError } from '../carbon-estimator-form/carbon-estimator-form.constants';

describe('ErrorSummaryComponent', () => {
  let component: ErrorSummaryComponent;
  let fixture: ComponentFixture<ErrorSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorSummaryComponent);
    component = fixture.componentInstance;

    const validationErrors: ValidationError[] = [
      {
        inputId: 'input1',
        errorMessage: 'Input 1 must be greater than 0',
      },
      {
        inputId: 'input2',
        errorMessage: 'Input 2 must be greater than 0',
      },
    ];

    fixture.componentRef.setInput('validationErrors', validationErrors);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation error messages', () => {
    expect(fixture.nativeElement.textContent).toContain('Input 1 must be greater than 0');
    expect(fixture.nativeElement.textContent).toContain('Input 2 must be greater than 0');
  });
});
