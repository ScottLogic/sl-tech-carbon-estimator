import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpansionPanelButtonConfig, defaultButtonConfig, helperButtonConfig } from './expansion-panel.constants';

@Component({
  selector: 'expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent implements OnInit {
  @Input() helperPanel? = false;
  @Output() expandedChanged = new EventEmitter<void>();
  public expanded: boolean = true;
  public buttonConfig: ExpansionPanelButtonConfig = defaultButtonConfig;

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit();
  }

  ngOnInit(): void {
    if (this.helperPanel) {
      this.expanded = false;
      this.buttonConfig = helperButtonConfig;
    }
  }
}
