import { ElementRef } from '@angular/core';
import { ExternalLinkDirective } from './external-link.directive';

describe('ExternalLinkDirective', () => {
  let element: ElementRef;

  beforeEach(() => {
    element = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['setAttribute']),
    };
  });

  it('should set required attributes on element', () => {
    const directive = new ExternalLinkDirective(element);
    expect(directive).toBeTruthy();
    expect(element.nativeElement.setAttribute).toHaveBeenCalledWith('target', '_blank');
    expect(element.nativeElement.setAttribute).toHaveBeenCalledWith('rel', 'noreferrer');
  });
});
