import { Component } from '@angular/core';
import { ExpansionPanelComponent } from '../expansion-panel/expansion-panel.component';

@Component({
  selector: 'disclaimer',
  standalone: true,
  imports: [ExpansionPanelComponent],
  templateUrl: './disclaimer.component.html',
})
export class DisclaimerComponent {}
