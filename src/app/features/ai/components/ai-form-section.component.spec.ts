import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AiFormSectionComponent } from './ai-form-section.component';
import { AiFormService } from '../services/ai-form.service';
import { WorldLocation } from '../../../types/carbon-estimator';
import { AiTaskType } from '../types/ai-energy-data';
import { AiProvider } from '../types/ai-types';

describe('AiFormSectionComponent', () => {
  let component: AiFormSectionComponent;
  let fixture: ComponentFixture<AiFormSectionComponent>;
  let aiFormServiceMock: Partial<AiFormService>;

  beforeEach(async () => {
    aiFormServiceMock = {
      form: new FormBuilder().nonNullable.group({
        noAiInference: [false],
        primaryTaskType: ['text-generation' as AiTaskType],
        monthlyInferences: [1234, [Validators.required, Validators.min(1)]],
        aiServiceProvider: ['openai' as AiProvider],
        aiServiceLocation: ['WORLD' as WorldLocation],
      }),
    };

    await TestBed.configureTestingModule({
      imports: [AiFormSectionComponent, ReactiveFormsModule],
      providers: [{ provide: AiFormService, useValue: aiFormServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AiFormSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('monthlyInferences getter returns control', () => {
    expect(component.monthlyInferences).toBeTruthy();
    expect(component.monthlyInferences!.value).toBe(1234);
  });

  it('noAiInference getter returns boolean value and updates', () => {
    expect(component.noAiInference).toBe(false);
    component.aiInferenceForm.get('noAiInference')!.setValue(true);
    expect(component.noAiInference).toBe(true);
  });

  it('should have default AI inference form values', () => {
    const aiInferenceForm = component.aiInferenceForm;
    expect(aiInferenceForm?.get('noAiInference')?.value).toBeFalse();
    expect(aiInferenceForm?.get('primaryTaskType')?.value).toBe('text-generation');
    expect(aiInferenceForm?.get('monthlyInferences')?.value).toBe(1234);
    expect(aiInferenceForm?.get('aiServiceProvider')?.value).toBe('openai');
    expect(aiInferenceForm?.get('aiServiceLocation')?.value).toBe('WORLD');
  });

  it('should validate form when AI inference is disabled and monthly inferences is zero', () => {
    const aiInferenceForm = component.aiInferenceForm;
    aiInferenceForm?.get('noAiInference')?.setValue(true);
    aiInferenceForm?.get('monthlyInferences')?.setValue(0);
    fixture.detectChanges();
    expect(aiInferenceForm.valid).toBeTruthy();
  });

  it('should invalidate form when AI inference is enabled and monthly inferences is zero', () => {
    const aiInferenceForm = component.aiInferenceForm;
    aiInferenceForm?.get('noAiInference')?.setValue(false);
    aiInferenceForm?.get('monthlyInferences')?.setValue(0);
    fixture.detectChanges();
    expect(aiInferenceForm.valid).toBeFalsy();
  });
});
