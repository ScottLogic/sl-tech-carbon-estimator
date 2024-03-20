import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sl-expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  public expanded: boolean = true;

  toggle() {
    this.expanded = !this.expanded;
  }
}
