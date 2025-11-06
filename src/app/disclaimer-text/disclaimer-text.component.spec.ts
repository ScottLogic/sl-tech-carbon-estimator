import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerTextComponent } from './disclaimer-text.component';

describe('DisclaimerComponent', () => {
  let component: DisclaimerTextComponent;
  let fixture: ComponentFixture<DisclaimerTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisclaimerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
