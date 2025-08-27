import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputGroupDisplay } from './input-group-display.component';

describe('InputValueDisplay', () => {
  let component: InputGroupDisplay;
  let fixture: ComponentFixture<InputGroupDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputGroupDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputGroupDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
