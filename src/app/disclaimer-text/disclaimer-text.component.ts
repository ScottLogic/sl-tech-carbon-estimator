import { Component } from '@angular/core';
import { ExternalLinkDirective } from '../directives/external-link.directive';

@Component({
  selector: 'disclaimer-text',
  standalone: true,
  imports: [ExternalLinkDirective],
  templateUrl: './disclaimer-text.component.html',
})
export class DisclaimerTextComponent {}
