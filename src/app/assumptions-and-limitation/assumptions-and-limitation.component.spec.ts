import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssumptionsAndLimitationComponent } from './assumptions-and-limitation.component';

describe('AssumptionsAndLimitationComponent', () => {
  let component: AssumptionsAndLimitationComponent;
  let fixture: ComponentFixture<AssumptionsAndLimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssumptionsAndLimitationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssumptionsAndLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
