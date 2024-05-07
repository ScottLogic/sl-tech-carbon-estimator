# Components

This page details the Angular components that are part of the application and how they relate to each other.

```mermaid
flowchart TB
  subgraph Components
    CarbonEstimator["`CarbonEstimatorComponent
    carbon-estimator`"]
    CarbonEstimatorForm["`CarbonEstimatorFormComponent
    carbon-estimator-form`"]
    CarbonEstimation["`CarbonEstimationComponent
    carbon-estimation`"]
    Assumptions["`AssumptionsAndLimitationComponent
    assumptions-and-limitation`"]
    HelperInfo["`HelperInfoComponent
    helper-info`"]
    Note["`NoteComponent
    note`"]
    ExpansionPanel["`ExpansionPanelComponent
    expansion-panel`"]
  end
  subgraph Services
    CarbonEstimationService
    CarbonIntensityService
  end
  subgraph Pipes
    FormatCostRangePipe
  end

  CarbonEstimator --> CarbonEstimatorForm & CarbonEstimation & Assumptions
  CarbonEstimatorForm ---> FormatCostRangePipe
  CarbonEstimatorForm --> HelperInfo & Note
  CarbonEstimator & CarbonEstimatorForm ---> CarbonEstimationService
  CarbonEstimatorForm & CarbonEstimation --> ExpansionPanel
  CarbonEstimationService & Assumptions --> CarbonIntensityService
```

## CarbonEstimatorComponent

Chooses which of its sub-components to display based on the current state.  
Receives events from sub components to transition between states.  
Uses the [CarbonEstimationService](services.md#carbonestimationservice) to produce the estimation for display.

## CarbonEstimatorFormComponent

The main form for user input, takes care of validation and updates descriptions in response to input changes.  
Uses the [CarbonEstimationService](services.md#carbonestimationservice) to estimate the number of servers.  
Uses the [FormatCostRangePipe](pipes.md#formatcostrangepipe) to display the monthly cloud bill options.

## CarbonEstimationComponent

Visualises the Carbon Estimation result.

## AssumptionsAndLimitationComponent

Provides information on the Assumptions and Limitations of the estimation.  
Uses the [CarbonIntensityService](services.md#carbonintensityservice) to get the latest carbon intensity figures to display.

## HelperInfoComponent

Displays a help button which can be clicked to show extra details on how the form inputs are used.

## NoteComponent

Highlights assumptions that will be made when certain options are selected.

## ExpansionPanelComponent

Displays explanatory text that can be hidden if desired.
