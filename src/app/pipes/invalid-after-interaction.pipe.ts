import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'invalidAfterInteraction',
  standalone: true,
  pure: false,
})
export class InvalidAfterInteractionPipe implements PipeTransform {
  transform(control: AbstractControl | null): boolean {
    return !!(control?.invalid && (control.dirty || control.touched));
  }
}
