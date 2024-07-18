import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';

@Component({
  selector: 'tab-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-item.component.html',
})
export class TabItemComponent {
  public active = model(false);
  public title = input.required<string>();
  @Output() public tabSelected = new EventEmitter<void>();
}
