import { Component, ContentChildren, QueryList } from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'tabs',
  standalone: true,
  imports: [TabItemComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  selectTab(selectedTab: TabItemComponent) {
    this.tabs.filter(tab => tab.active()).forEach(tab => tab.active.set(false));
    selectedTab.active.set(true);
  }
}
