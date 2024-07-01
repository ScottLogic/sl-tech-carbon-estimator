import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'invalidAndInteraction',
  standalone: true,
  pure: false,
})
export class InvalidAndInteractionPipe implements PipeTransform {
  transform(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
