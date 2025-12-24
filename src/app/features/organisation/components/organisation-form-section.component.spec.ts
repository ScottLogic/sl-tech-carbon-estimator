import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganisationFormSectionComponent } from './organisation-form-section.component';
import { OrganisationFormService, defaultValues } from '../services/organisation-form.service';

describe('OrganisationFormSectionComponent', () => {
  let fixture: ComponentFixture<OrganisationFormSectionComponent>;
  let component: OrganisationFormSectionComponent;
  let form: FormGroup;

  beforeEach(async () => {
    form = new FormBuilder().nonNullable.group({
      headCount: [defaultValues.headCount],
      desktopPercentage: [defaultValues.desktopPercentage],
      employeeLocation: [defaultValues.employeeLocation],
    });

    const mockFormService = { form } as Partial<OrganisationFormService>;

    await TestBed.configureTestingModule({
      imports: [OrganisationFormSectionComponent],
      providers: [{ provide: OrganisationFormService, useValue: mockFormService }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationFormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initial desktop and laptop percentages reflect defaults', () => {
    expect(component.desktopPercentage()).toBe(defaultValues.desktopPercentage);
    expect(component.laptopPercentage()).toBe(100 - defaultValues.desktopPercentage);
  });

  it('updates desktopPercentage and laptopPercentage when percentage input changes', () => {
    const percentageInputElement: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[id="desktopPercentage"]'
    );
    percentageInputElement.value = '80';
    percentageInputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.desktopPercentage()).toBe(80);
    expect(component.laptopPercentage()).toBe(20);
  });
});
