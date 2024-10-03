import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabItemComponent } from './tab-item.component';

describe('TabItemComponent', () => {
  let component: TabItemComponent;
  let fixture: ComponentFixture<TabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabItemComponent);
    fixture.componentRef.setInput('title', 'Tab Title');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
