import { Component, Input } from '@angular/core';
import { SatPopoverModule } from '@ncstate/sat-popover';

@Component({
  selector: 'helper-info',
  standalone: true,
  imports: [SatPopoverModule],
  templateUrl: './helper-info.component.html',
})
export class HelperInfoComponent {
  @Input() inputLabel!: string;
}
