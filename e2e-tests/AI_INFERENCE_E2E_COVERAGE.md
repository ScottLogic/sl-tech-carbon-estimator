# AI Inference E2E Test Coverage

This document outlines the comprehensive end-to-end test coverage for AI inference functionality in the Carbon Estimator application.

## 📁 New Test Files

### Core AI Inference Workflows (`T21-T26-ai-inference-workflows.spec.ts`)
- **T21**: Basic AI inference workflow with text generation
- **T22**: AI inference disabled workflow  
- **T23**: Different AI task types comparison
- **T24**: High volume AI inference scenario
- **T25**: AI inference form validation
- **T26**: Different AI service providers

### Complete User Journey (`T28-T29-ai-inference-complete-journey.spec.ts`)
- **T28**: Complete AI inference user journey (end-to-end workflow)
- **T29**: AI inference reset functionality

### Accessibility Testing (`T27-ai-inference-accessibility.spec.ts`)
- AI inference accessibility in light mode
- AI inference accessibility in dark mode  
- Form validation accessibility

## 🧪 Test Coverage Areas

### 1. Form Interactions
- ✅ AI inference section visibility
- ✅ Checkbox toggle (enable/disable AI inference)
- ✅ Task type dropdown selection
- ✅ Monthly inferences input
- ✅ Service provider selection
- ✅ Form validation and error handling

### 2. AI Task Types Tested
- ✅ Text Generation (OpenAI GPT-style)
- ✅ Image Generation (DALL-E style) 
- ✅ Text Classification
- ✅ Question Answering
- ✅ Mixed Usage (Average)

### 3. Service Providers Tested
- ✅ OpenAI
- ✅ Anthropic
- ✅ Google AI
- ✅ Microsoft Azure AI
- ✅ Amazon Bedrock
- ✅ Meta AI
- ✅ Other

### 4. Calculation Scenarios
- ✅ Small organization (50 employees, 10K inferences)
- ✅ Medium organization (500 employees, 500K inferences)
- ✅ Large organization (1000 employees, 1M inferences)
- ✅ High-energy tasks (Image Generation)
- ✅ Low-energy tasks (Text Classification)

### 5. Visualization Testing
- ✅ AI inference in treemap visualization (kg view)
- ✅ AI inference in treemap visualization (percentage view)
- ✅ AI inference in table view
- ✅ Screenshot regression testing
- ✅ Chart interaction and toggling

### 6. Integration Testing
- ✅ AI inference with all other form sections
- ✅ Form reset functionality
- ✅ State persistence and form interactions
- ✅ Error handling and validation
- ✅ Complete user workflow from form to results

### 7. Accessibility Testing
- ✅ WCAG compliance with AI inference enabled
- ✅ WCAG compliance with AI inference disabled  
- ✅ Dark mode accessibility
- ✅ Form validation accessibility
- ✅ Screen reader compatibility

## 🗂️ Page Objects Architecture

### New Page Object: `AIInferenceSection`
**Location**: `e2e-tests/page-objects/ai-inference-section.ts`

**Key Methods**:
- `assertAIInferenceSectionVisible()`
- `assertAIInferenceFormElementsVisible/Hidden()`
- `checkNoAIInference()` / `uncheckNoAIInference()`
- `selectPrimaryTaskType()` / `setMonthlyInferences()`
- `selectAIServiceProvider()`
- Helper methods for each task type and service provider

### Enhanced Page Objects

**TableSection** - Added AI inference table assertions:
- `assertTableContainsAIInference()`
- `assertTableDoesNotContainAIInference()`
- `assertAIInferenceHighContribution()`

**TcsEstimator** - Added reset button:
- `resetButton` locator for form reset testing

**Fixtures** - Updated to include `aiInferenceSection`

## 🚀 Running AI Inference E2E Tests

```bash
# Install Playwright browsers (one time)
npm run playwright-install

# Run all AI inference tests
npm run playwright-test -- T21-T26-ai-inference-workflows.spec.ts
npm run playwright-test -- T27-ai-inference-accessibility.spec.ts  
npm run playwright-test -- T28-T29-ai-inference-complete-journey.spec.ts

# Run specific test
npm run playwright-test -- -g "T21"

# Run with UI mode (interactive)
npm run playwright-test -- --ui T21-T26-ai-inference-workflows.spec.ts

# Update screenshots (after UI changes)
npm run playwright-test -- --update-snapshots
```

## 📊 Test Scenarios Summary

| Test ID | Scenario | AI Task | Inferences | Provider | Focus Area |
|---------|----------|---------|------------|----------|------------|
| T21 | Basic workflow | Text Generation | 10,000 | OpenAI | Happy path |
| T22 | Disabled AI | N/A | N/A | N/A | Toggle functionality |
| T23 | Task comparison | Multiple | 50,000 | OpenAI | Energy differences |
| T24 | High volume | Image Generation | 1,000,000 | Amazon | Scale testing |
| T25 | Form validation | Text Generation | Invalid | OpenAI | Error handling |
| T26 | Provider comparison | Text Generation | 25,000 | Multiple | Provider differences |
| T27 | Accessibility | Text Generation | 25,000 | OpenAI | WCAG compliance |
| T28 | Complete journey | Multiple | Multiple | Multiple | End-to-end workflow |
| T29 | Reset functionality | Mixed Usage | 250,000 | Google | State management |

## 🎯 Test Verification Points

Each test verifies multiple aspects:

1. **Form State**: Correct form field values and visibility
2. **Calculations**: AI inference properly included in carbon calculations  
3. **Visualizations**: Charts display AI inference data correctly
4. **Screenshots**: Visual regression testing for UI consistency
5. **Table Data**: AI inference appears in table breakdown
6. **Accessibility**: Screen reader and keyboard navigation support
7. **Integration**: Works correctly with other form sections

## 📝 Usage Examples

### Basic AI Inference Test Pattern
```typescript
// Setup form data
await organisationSection.selectNumberOfEmployess('100');
await onPremSection.selectNumberOfServers('10');
// ... other sections ...

// Configure AI inference
await aiInferenceSection.selectTextGeneration();
await aiInferenceSection.setMonthlyInferences('25000');
await aiInferenceSection.selectOpenAI();

// Verify results
await tcsEstimator.calculateButton.click();
await diagramSection.assertDiagramScreenshot('test-result.png');
await tableSection.assertTableContainsAIInference();
```

### Accessibility Testing Pattern
```typescript
// Configure and calculate
await aiInferenceSection.selectTextGeneration();
await tcsEstimator.calculateButton.click();

// Run accessibility audit
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);
```

This comprehensive E2E test suite ensures that AI inference functionality works correctly across all user workflows, maintains visual consistency, and provides an accessible experience for all users.