import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  @Output() expandedChanged = new EventEmitter<void>();
  public expanded: boolean = true;

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit();
  }
}
