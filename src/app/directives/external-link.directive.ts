import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tce-external-link]',
  standalone: true,
})
export class ExternalLinkDirective {
  constructor(private element: ElementRef) {
    this.element.nativeElement.setAttribute('target', '_blank');
    this.element.nativeElement.setAttribute('rel', 'noreferrer');
  }
}
