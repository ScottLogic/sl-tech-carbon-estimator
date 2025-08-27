import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, input, model, OnInit, Output } from '@angular/core';
import { camelCase } from 'lodash-es';

@Component({
  selector: 'tab-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-item.component.html',
})
export class TabItemComponent implements OnInit {
  public active = model(false);
  public title = input.required<string>();
  public tabIdPrefix!: string;
  @Output() public tabSelected = new EventEmitter<void>();

  constructor() {
    effect(() => {
      if (this.active()) {
        this.tabSelected.emit();
      }
    });
  }

  ngOnInit(): void {
    this.tabIdPrefix = camelCase(this.title());
  }
}
