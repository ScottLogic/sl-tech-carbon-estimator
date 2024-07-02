import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'invalidated',
  standalone: true,
  pure: false,
})
export class InvalidatedPipe implements PipeTransform {
  transform(control: AbstractControl | null): boolean {
    if (control === null) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }
}
