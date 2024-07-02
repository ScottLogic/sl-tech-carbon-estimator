import { FormControl, Validators } from '@angular/forms';
import { InvalidatedPipe } from './invalidated.pipe';

describe('InvalidatedPipe', () => {
  it('create an instance', () => {
    const pipe = new InvalidatedPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return false if the control is valid and there has been no interaction', () => {
    const formControl = new FormControl('hello', Validators.required);
    const pipe = new InvalidatedPipe();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return false if the control is valid and there has been interaction', () => {
    const formControl = new FormControl('hello', Validators.required);
    const pipe = new InvalidatedPipe();
    formControl.markAsDirty();
    formControl.markAsTouched();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return false if the control is invalid and there has been no interaction', () => {
    const formControl = new FormControl('', Validators.required);
    const pipe = new InvalidatedPipe();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return true if the control is invalid and there has been interaction', () => {
    const formControl = new FormControl('', Validators.required);
    const pipe = new InvalidatedPipe();
    formControl.markAsDirty();
    formControl.markAsTouched();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeTrue();
  });
});
