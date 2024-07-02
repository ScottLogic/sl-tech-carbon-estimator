import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'invalidated',
  standalone: true,
  pure: false,
})
export class InvalidatedPipe implements PipeTransform {
  transform(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
