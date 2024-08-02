import { Component } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';
import { ExternalLinkDirective } from '../directives/external-link.directive';

@Component({
  selector: 'disclaimer',
  standalone: true,
  imports: [ExpansionPanelComponent, ExternalLinkDirective],
  templateUrl: './disclaimer.component.html',
})
export class DisclaimerComponent {}
