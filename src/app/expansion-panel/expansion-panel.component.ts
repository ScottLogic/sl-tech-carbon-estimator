import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultConfig, questionPanelConfig } from './expansion-panel.constants';

@Component({
  selector: 'expansion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expansion-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent implements OnInit {
  @Input() questionPanel?: boolean = false;
  @Output() expandedChanged = new EventEmitter<void>();
  public expanded: boolean = defaultConfig.startsExpanded;
  public buttonStyles: string = defaultConfig.buttonStyles;
  public contentContainerStyles: string = defaultConfig.contentContainerStyles;

  toggle() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit();
  }

  ngOnInit(): void {
    if (this.questionPanel) {
      this.expanded = questionPanelConfig.startsExpanded;
      this.buttonStyles = questionPanelConfig.buttonStyles;
      this.contentContainerStyles = questionPanelConfig.contentContainerStyles;
    }
  }
}
