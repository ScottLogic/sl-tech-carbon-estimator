import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

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

  selectAndFocusTab(selectedTabIndex: number) {
    const newTab = this.tabs.get(selectedTabIndex)!;
    const newTabButton = this.tabButtons.get(selectedTabIndex)!;
    this.selectTab(newTab);
    newTabButton.nativeElement.focus();
  }

  setSelectedToNextTab(currentTabIndex: number) {
    let newTabIndex: number;
    if (currentTabIndex === this.tabs.length - 1) {
      newTabIndex = 0;
    } else {
      newTabIndex = currentTabIndex + 1;
    }
    this.selectAndFocusTab(newTabIndex);
  }

  setSelectedToPreviousTab(currentTabIndex: number) {
    let newTabIndex: number;
    if (currentTabIndex === 0) {
      newTabIndex = this.tabs.length - 1;
    } else {
      newTabIndex = currentTabIndex - 1;
    }
    this.selectAndFocusTab(newTabIndex);
  }

  public onKeydown(event: KeyboardEvent, currentIndex: number) {
    let flag = false;
    switch (event.key) {
      case 'ArrowRight':
        flag = true;
        this.setSelectedToNextTab(currentIndex);
        break;

      case 'ArrowLeft':
        flag = true;
        this.setSelectedToPreviousTab(currentIndex);
        break;

      case 'Home':
        flag = true;
        this.selectAndFocusTab(0);
        break;

      case 'End':
        flag = true;
        this.selectAndFocusTab(this.tabs.length - 1);
        break;

      default:
        break;
    }
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
