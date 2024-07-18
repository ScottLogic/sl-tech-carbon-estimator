import { TestBed } from '@angular/core/testing';
import { MockRender, ngMocks } from 'ng-mocks';
import { TabsComponent } from './tabs.component';
import { TabItemComponent } from '../tab-item/tab-item.component';

describe('TabsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent, TabItemComponent],
    }).compileComponents();
  });

  it('should select 1st tab is no active tab', () => {
    const fixture = MockRender(`
      <tabs>
        <tab-item [title]="'tab 1'">Test</tab-item>
        <tab-item [title]="'tab 2'">Test</tab-item>
      </tabs>`);

    const component = ngMocks.findInstance(TabsComponent);
    fixture.detectChanges();

    expect(component.tabs.first.active()).toBeTrue();
  });

  it('should select 1st active tab when multiple active tabs', () => {
    const fixture = MockRender(`
      <tabs>
        <tab-item [title]="'tab 1'"></tab-item>
        <tab-item [title]="'tab 2'" [active]="true"></tab-item>
        <tab-item [title]="'tab 3'" [active]="true"></tab-item>
      </tabs>`);

    const component = ngMocks.findInstance(TabsComponent);
    fixture.detectChanges();

    const activeTabs = component.tabs.filter(tab => tab.active());
    expect(activeTabs.length).toBe(1);
    expect(activeTabs[0].title()).toBe('tab 2');
  });
});
