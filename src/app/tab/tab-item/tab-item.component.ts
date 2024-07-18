import { Component, input, model } from '@angular/core';

@Component({
  selector: 'tab-item',
  standalone: true,
  imports: [],
  templateUrl: './tab-item.component.html',
})
export class TabItemComponent {
  public active = model(false);
  public title = input.required<string>();
}
