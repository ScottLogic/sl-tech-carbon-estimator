import { Component, input } from '@angular/core';
import { ExpansionPanelComponent } from '../../expansion-panel/expansion-panel.component';

@Component({
  selector: 'section-header',
  templateUrl: './section-header.component.html',
  standalone: true,
  imports: [ExpansionPanelComponent],
})
export class SectionHeaderComponent {
  heading = input();
  sectionDetails = input();
}
