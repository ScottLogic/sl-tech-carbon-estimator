import { FormControl, Validators } from '@angular/forms';
import { InvalidAndInteractionPipe } from './invalid-and-interaction.pipe';

describe('InvalidAndInteractionPipe', () => {
  it('create an instance', () => {
    const pipe = new InvalidAndInteractionPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return false if the control is valid and there has been no interaction', () => {
    const formControl = new FormControl('hello', Validators.required);
    const pipe = new InvalidAndInteractionPipe();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return false if the control is valid and there has been interaction', () => {
    const formControl = new FormControl('hello', Validators.required);
    const pipe = new InvalidAndInteractionPipe();
    formControl.markAsDirty();
    formControl.markAsTouched();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return false if the control is invalid and there has been no interaction', () => {
    const formControl = new FormControl('', Validators.required);
    const pipe = new InvalidAndInteractionPipe();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeFalse();
  });

  it('should return true if the form is invalid and there has been interaction', () => {
    const formControl = new FormControl('', Validators.required);
    const pipe = new InvalidAndInteractionPipe();
    formControl.markAsDirty();
    formControl.markAsTouched();

    const transformed = pipe.transform(formControl);
    expect(transformed).toBeTrue();
  });
});
