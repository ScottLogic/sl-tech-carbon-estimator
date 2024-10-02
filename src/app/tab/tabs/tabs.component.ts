import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'tabs',
  standalone: true,
  imports: [TabItemComponent],
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  public ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active());

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    } else if (activeTabs.length > 1) {
      this.selectTab(activeTabs[0]);
    }
  }

  public selectTab(selectedTab: TabItemComponent) {
    this.tabs.filter(tab => tab.active()).forEach(tab => tab.active.set(false));
    selectedTab.active.set(true);
  }

  public onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        console.log('right');
        break;

      case 'ArrowLeft':
        console.log('left');
        break;

      case 'Home':
        console.log('home');
        break;

      case 'End':
        console.log('end');
        break;

      default:
        break;
    }
  }
}
