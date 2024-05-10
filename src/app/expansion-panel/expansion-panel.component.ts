import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpansionPanelConfig, defaultConfig } from './expansion-panel.constants';

@Component({
  selector: 'expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent implements OnInit {
  @Input() configOverride?: Partial<ExpansionPanelConfig> = {};
  @Output() expandedChanged = new EventEmitter<void>();
  public config: ExpansionPanelConfig = defaultConfig;
  public expanded: boolean = defaultConfig.startsExpanded;

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit();
  }

  ngOnInit(): void {
    this.config = {
      ...this.config,
      ...this.configOverride,
    };
    this.expanded = this.config.startsExpanded;
  }
}
