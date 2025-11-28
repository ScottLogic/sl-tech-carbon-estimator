import { ElementRef } from '@angular/core';
import { ExternalLinkDirective } from './external-link.directive';
import { TestBed } from '@angular/core/testing';

describe('ExternalLinkDirective', () => {
  let element: ElementRef;
  let directive: ExternalLinkDirective;

  beforeEach(() => {
    element = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['setAttribute']),
    };
    TestBed.configureTestingModule({
      providers: [ExternalLinkDirective, { provide: ElementRef, useValue: element }],
    });
    directive = TestBed.inject(ExternalLinkDirective);
  });

  it('should set required attributes on element', () => {
    expect(directive).toBeTruthy();
    expect(element.nativeElement.setAttribute).toHaveBeenCalledWith('target', '_blank');
    expect(element.nativeElement.setAttribute).toHaveBeenCalledWith('rel', 'noreferrer');
  });
});
