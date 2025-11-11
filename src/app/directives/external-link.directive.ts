import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[tce-external-link]',
  standalone: true,
})
export class ExternalLinkDirective {
  private element = inject(ElementRef);

  constructor() {
    this.element.nativeElement.setAttribute('target', '_blank');
    this.element.nativeElement.setAttribute('rel', 'noreferrer');
  }
}
