# Form Architecture

This document describes how the Technology Carbon Estimator form is structured and how data flows through the system. It's designed for developers who need to understand, maintain, or extend the form.

## Overview

The form is built using a **hierarchical, service-based composition pattern** with six independent form sections that collect user inputs across different categories of carbon emissions. Each section is a standalone Angular component with its own validation logic and default values.

The form uses **reactive forms** (FormGroup and FormControl) to manage state, with automatic persistence to session storage. This allows users to navigate away and return without losing their input.

## Form Architecture Pattern

### Design Principles

The form follows these principles:

- **Modular**: Each section is independent and can be developed/tested in isolation
- **Composable**: Sections are combined by a root service that creates the final form structure
- **Persistent**: Form state is automatically saved when the user navigates away
- **Reactive**: The form updates and triggers calculations in response to user input
- **Type-Safe**: Strong TypeScript typing throughout prevents runtime errors

### Component Hierarchy

```
CarbonEstimatorComponent (root web component)
└── CarbonEstimatorFormComponent (main form container)
    ├── ErrorSummaryComponent (displays validation errors)
    ├── OrganisationFormSectionComponent
    ├── OnPremiseFormSectionComponent
    ├── CloudFormSectionComponent
    ├── SaaSFormSectionComponent
    │   └── Microsoft365FormSectionComponent (nested subsection)
    ├── CustomerFormSectionComponent
    └── AiFormSectionComponent
```

Each section component imports data from user inputs and feeds that data up to the parent form component.

## The Six Form Sections

The form is divided into six sections that align with the **Technology Carbon Standard (TCS)** framework:

### 1. Organisation (Upstream Emissions)

**Purpose**: Captures employee infrastructure and device usage.

**Inputs**:
- **Employee headcount**: Number of employees in the organization
- **Device split**: Percentage using desktop vs laptop (slider: 0-100%)
- **Employee location**: Geographic region where most employees are located

**Default Values**: 100 employees, 50% desktop, World location

**Validation**: Employee headcount requires minimum of 1

**Why it matters**: Used to estimate upstream carbon from manufacturing devices and supply chain impacts.

---

### 2. On-Premise Servers (Direct Emissions)

**Purpose**: Captures carbon from physical servers operated by the organization.

**Inputs**:
- **Server count estimation**: Option to auto-estimate based on headcount or enter manually
- **Number of servers**: Actual number of on-premise servers
- **Server location**: Geographic region hosting the servers

**Default Values**: Manual mode disabled, 10 servers, World location

**Special Feature**: Auto-estimation uses a formula based on employee count and cloud usage percentage. When enabled, the form shows an estimated server preview that updates as users change their headcount or cloud percentage.

**Why it matters**: Direct emissions from server power consumption and cooling.

---

### 3. Cloud Services (Indirect Emissions)

**Purpose**: Captures carbon from cloud infrastructure usage.

**Inputs**:
- **Cloud usage toggle**: Whether the organization uses cloud services
- **Cloud percentage**: How much of infrastructure is cloud-based (slider: 0-100%)
- **Monthly cloud bill**: Estimated monthly spending on cloud services (12 predefined ranges)
- **Cloud location**: Geographic region hosting cloud services

**Default Values**: Not using cloud (checkbox off), 50% if enabled, $0-1K range, World location

**Special Feature**: When disabled, all cloud inputs are hidden. The cloud percentage and on-premise percentage are complementary (they sum to 100%).

**Why it matters**: Indirect emissions from cloud data centers, proportional to usage and spending.

---

### 4. SaaS Services (Indirect Emissions)

**Purpose**: Captures carbon from Software-as-a-Service subscriptions, including Microsoft 365.

**Inputs**:
- **Microsoft 365 toggle**: Whether the organization uses Microsoft 365
- **Microsoft 365 user count**: Number of users with Microsoft 365 licenses

**Default Values**: Not using Microsoft 365 (checkbox off), 0 users if enabled

**Architecture Note**: This section uses a nested form group pattern. The main SaaS section contains Microsoft 365 as a subsection. This design allows easy addition of other SaaS providers (Google Workspace, Salesforce, etc.) in the future.

**Validation**: Requires at least 1 user when Microsoft 365 is enabled.

**Why it matters**: Indirect emissions from cloud productivity software.

---

### 5. Customers/Downstream (Downstream Emissions)

**Purpose**: Captures carbon from end-user devices and networks accessing the digital service.

**Inputs**:
- **Downstream toggle**: Whether the organization has end-users
- **Monthly active users**: Number of users accessing the service monthly
- **Device split**: Percentage using mobile vs desktop (slider: 0-100%)
- **Service purpose**: Type of digital service (Information, E-Commerce, Social Media, Streaming, or Average)
- **Customer location**: Geographic region of end-users

**Default Values**: Downstream enabled, 100 users, 50% mobile, Average purpose, World location

**Validation**: Requires at least 1 monthly active user when downstream is enabled.

**Why it matters**: Emissions from end-user devices and the energy required to deliver digital content.

---

### 6. AI Inference (Emerging Category)

**Purpose**: Captures carbon from artificial intelligence model inference workloads.

**Inputs**:
- **AI usage toggle**: Whether the organization uses AI inference
- **Primary task type**: Type of AI task (LLM, Image Generation, Image Classification, Embedding Model, Computer Vision, Mixed Usage, Other)
- **Monthly inferences**: Number of AI model inference requests per month
- **AI service provider**: Which AI service provider is used (OpenAI, Anthropic, Google, Microsoft, AWS, Meta, Hugging Face, Other)
- **Service location**: Geographic region where the AI service is hosted

**Default Values**: Not using AI (checkbox off), Text Generation, 1000 inferences, OpenAI, World location

**Validation**: Requires at least 1 inference when AI is enabled.

**Why it matters**: AI model inference consumes significant energy and is a growing contribution to organizational carbon footprint.

---

## Data Flow: From Input to Estimation

```
User enters data in form section
        ↓
FormControl value changes
        ↓
Form automatically saved to session storage
   (on visibility change or navigation)
        ↓
Estimation service updates preview
   (e.g., estimated server count)
        ↓
User clicks "Calculate"
        ↓
Form validation runs
        ↓
If valid: Estimation service calculates
   carbon across all categories
        ↓
Results displayed in pie charts
```

## Form State Management

The form uses a three-layer approach to managing state:

### Layer 1: FormService (In-Memory)

The `FormService` creates and maintains the root `FormGroup`. It:
- Composes all six section form groups into a single typed form
- Loads persisted values from storage when the component initializes
- Provides default values for all inputs

### Layer 2: FormStateService (Control State)

The `FormStateService` tracks which controls the user has modified or interacted with. It maintains:
- Whether each field is "dirty" (user modified it)
- Whether each field is "touched" (user focused and blurred it)
- Whether the form has been submitted

This information is used to determine when to show validation errors (only show errors on dirty/touched fields).

### Layer 3: StorageService (Persistence)

The `StorageService` saves form state to the browser's session storage. It automatically:
- Saves when the user switches tabs or windows (visibility change event)
- Saves when the component is destroyed (page unload)
- Loads and restores the form when returning to the page

This creates a seamless experience where users can step away and return without losing their work.

```
User Input in Form
        ↓
Form value change detected
        ↓
[Later] Tab becomes hidden (visibility change)
        ↓
FormStateService serializes current form state
        ↓
StorageService saves to sessionStorage
        ↓
[Later] User returns to page
        ↓
FormStateService retrieves from sessionStorage
        ↓
FormService restores form values
        ↓
Form displays with user's previous inputs
```

## Validation Strategy

The form uses **minimal, targeted validation**:

**Validated Fields**:
- Organization headcount: minimum 1 employee
- On-premise servers: minimum 0
- Monthly active users: minimum 1 (when downstream enabled)
- AI monthly inferences: minimum 1 (when AI enabled)
- Microsoft 365 user count: minimum 1 (when enabled)

**Validation Approach**:
- Validations are applied to numeric inputs to ensure reasonable values
- Optional sections (Cloud, SaaS, AI, Downstream) can be completely disabled via toggle
- The form allows submission with partial data (e.g., organization only, no customers)
- Complex business validations happen in the estimation service, not the form

**Error Handling**:
- Validation errors only display after the user tries to submit
- An `ErrorSummaryComponent` shows all validation errors at once
- The user must fix errors and resubmit to calculate the estimation

## How Sections Communicate

Form sections communicate through the shared `FormGroup`:

1. **One-Way Data Binding**: Parent form component passes form values down to section components
2. **Form Value Changes**: When a user modifies an input, the reactive form automatically updates
3. **Preview Updates**: Some sections watch for changes in other sections. For example, the On-Premise section watches upstream headcount and cloud percentage to update the server count preview

Example: When a user changes their employee headcount from 100 to 200, the On-Premise section detects this change and immediately updates its estimated server count preview without requiring form submission.

## Supporting Services

### FormService
Creates and manages the root form group. Injects all six section services and combines their form groups into a single typed structure.

### FormStateService
Tracks which controls are dirty/touched and persists this state along with form values.

### StorageService
Provides an abstraction over browser session storage for persisting form state.

### CarbonEstimationService
Calculates carbon emissions from the form input values. Called both for previews (estimated servers) and final calculations.

### CarbonIntensityService
Looks up carbon intensity values for different geographic regions. Used by the estimation service to adjust emissions calculations by location.

### CarbonSchemaMapperService
Converts the form input structure into a standardized JSON schema (Technology Carbon Standard format) for export and reporting.

---

## Adding a New Form Section

To add a new form section to the estimator:

### 1. Create the Component
Create a new standalone Angular component in `src/app/features/{section-name}/` following the naming pattern of existing sections (e.g., `{section-name}-form-section.component.ts`).

### 2. Create the Form Service
Create a service in the same directory that:
- Creates and returns a typed `FormGroup` with all the inputs for your section
- Defines default values for all controls
- Applies any necessary validators

The service should follow the pattern of existing services like `OrganisationFormService` or `CloudFormService`.

### 3. Update the Root FormService
Add your new section service to the root `FormService`:
- Inject your new section service
- Add your section's form group to the root form group
- Update the `EstimatorValues` type to include your new section

### 4. Add the Component to the Main Form
In `CarbonEstimatorFormComponent`:
- Import your new section component
- Add it to the component's template in the appropriate location

### 5. Update the Type Definitions
Add your new section's type definition to the `types/carbon-estimator.ts` file so it integrates with the form's type system.

### 6. Create an Estimation Module
If your section contributes to carbon calculations:
- Create an `estimate-{section-name}-emissions.ts` module with functions to calculate emissions
- Update `CarbonEstimationService` to call your estimation functions

### 7. Add Section to Estimation Components
Update `CarbonEstimationComponent` to display your section's results in the pie chart and breakdown table.

### 8. Document
Add documentation for your section in the form-architecture document and in the relevant type documentation.

---

## Key Patterns to Follow

When working with the form, follow these patterns:

### 1. Use Reactive Forms
Always use Angular's reactive forms (`FormGroup`, `FormControl`) with proper typing. This provides better testability and reactivity compared to template-driven forms.

### 2. Keep Sections Independent
Each section should manage its own form group and validation. Avoid tight coupling between sections (except through the shared root form).

### 3. Provide Sensible Defaults
Every form control should have a sensible default value. Users should be able to submit the form without required inputs if they don't want to estimate a particular category.

### 4. Use Signals for UI State
For component-level UI state (like showing/hiding fields), use Angular signals. Reserve the form group for user input data.

### 5. Validate at the Service Layer
Form validation should be minimal. Complex business logic validation happens in the estimation service, not in form validators.

### 6. Test Sections Independently
Each section component should be testable in isolation. Mock the `FormGroup` and services to test the component's behavior.

---

## Common Tasks

### Changing a Default Value
Edit the relevant section service and update the default value when creating the form control.

### Adding a New Input to a Section
Add a new form control to the section service, add the HTML input in the component template, and update the section's type definition.

### Changing Validation Rules
Update the validators array when creating the form control in the section service, and update validation error messages if needed.

### Adding a New Optional Section
Create your section like any other, but add a checkbox toggle (like Cloud Services, Downstream, or AI Inference). When the toggle is off, set the section's inputs to default values or zeros so they don't affect the calculation.
