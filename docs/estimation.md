# Estimation

The estimation folder contains modules and classes related to the estimation process.

```mermaid
classDiagram
  direction LR
  namespace TCS-categories {
    class estimate-upstream-emissions{
      <<module>>
      +estimateUpstreamEmissions(deviceCounts: DeviceCounts) UpstreamEstimation
    }

    class estimate-direct-emissions{
      <<module>>
      +estimateDirectEmissions(deviceCounts: DeviceCounts, onPremLocation: WorldLocation) DirectEstimation
    }

    class estimate-indirect-emissions{
      <<module>>
      -number COST_TO_KWH_RATIO
      -number COST_TO_UPSTREAM_RATIO
      +estimateIndirectEmissions(input: Cloud) IndirectEstimation
      -estimateCloudEnergy(monthlyCloudBill: number) KilowattHour
      -estimateCloudUpstream(monthlyCloudBill: number) KgCo2e
    }

    class estimate-downstream-emissions{
      <<module>>
      +siteTypeInfo: Record~PurposeOfSite, SiteInformation~
      -BYTES_IN_GIGABYTE: number
      +estimateDownstreamEmissions(downstream: Downstream) DownstreamEstimation
      -addAverage(input: Record~BasePurposeOfSite, SiteInformation~) Record~PurposeOfSite, SiteInformation~
      -estimateDownstreamDataTransfer(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite) Gb
      -estimateEndUserEmissions(downstream: Downstream, downstreamDataTransfer: number)
      -estimateEndUserTime(monthlyActiveUsers: number, purposeOfSite: PurposeOfSite) Hour
      -estimateEndUserEnergy(dataTransferred: Gb, userTime: Hour, mobilePercentage: number) KilowattHour 
      -estimateNetworkEmissions(downstream: Downstream, downstreamDataTransfer: number) 
    }
  }

  namespace supporting-modules{
    class device-type {
      <<module>>
      +laptop: DeviceType
      +desktop: DeviceType
      +server: DeviceType
      +network: DeviceType
      +mobile: DeviceType
      +tablet: DeviceType
      +monitor: DeviceType
      +averagePersonalComputer: AverageDeviceType
      +AverageDeviceType(...shares: DeviceShare[])
      -DeviceType(averagePower: Watt, averageYearlyUsage: Hour, averageEmbodiedCarbon: KgCo2e, averageLifespan: Year)
    }

    class estimate-energy-emissions {
      <<module>>
      -location_intensity_map: Record~WorldLocation, KgCo2ePerKwh~
      +estimateEnergyEmissions(energy: KilowattHour, location: WorldLocation) KgCo2e
      +getCarbonIntensity(location: WorldLocation) gCo2ePerKwh
    }
  }

  estimate-upstream-emissions ..> device-type
  estimate-direct-emissions ..> estimate-energy-emissions
  estimate-direct-emissions ..> device-type
  estimate-indirect-emissions ..> estimate-energy-emissions
  estimate-downstream-emissions ..> estimate-energy-emissions
  estimate-downstream-emissions ..> device-type
```

## estimate-upstream-emissions

### Exported functions

#### `estimateUpstreamEmissions()`

Estimate emissions from Upstream categories

##### Parameters

`deviceCounts: DeviceCounts` - The Device counts to estimate upstream emissions for.

##### Returns

`UpstreamEstimation` - Estimation of Upstream emissions under TCS categories.

## estimate-direct-emissions

### Exported functions

#### `estimateDirectEmissions()`

Estimate emissions from Direct categories

##### Parameters

`deviceCounts: DeviceCounts` - The Device counts to estimate upstream emissions for.
`onPremLocation: WorldLocation` - The World Location of the hardware for Carbon Intensity.

##### Returns

`DirectEstimation` - Estimation of Direct emissions under TCS categories.

## estimate-indirect-emissions

### Exported functions

#### `estimateIndirectEmissions()`

Estimate emissions from Indirect categories

##### Parameters

`input: Cloud` - The inputs relevant to cloud.

##### Returns

`IndirectEstimation` - Estimation of Indirect emissions under TCS categories.

## estimate-downstream-emissions

### Exported variables

#### `siteTypeInfo: Record<PurposeOfSite, SiteInformation>`

Exported to allow use in assumptions component.

```mermaid
classDiagram
class SiteInformation {
  <<interface>>
  averageMonthlyUserTime: Hour
  averageMonthlyUserData: Gb
}
```

---

### Exported functions

#### `estimateDownstreamEmissions()`

Estimate emissions from Downstream categories

##### Parameters

`downstream: Downstream` - The inputs relevant to downstream emissions.

##### Returns

`DownstreamEstimation` - Estimation of Downstream emissions under TCS categories.

## device-type

```mermaid
classDiagram
  direction TB
  class DeviceType {
    -averagePower: Watt
    -averageYearlyUsage: Hour
    -averageEmbodiedCarbon: KgCo2e
    -averageLifespan: Year
    +constructor(averagePower: Watt, averageYearlyUsage: Hour, averageEmbodiedCarbon: KgCo2e, averageLifespan: Year)
    +estimateYearlyEnergy(deviceCount: number) KilowattHour
    +estimateEnergy(usage: Hour) KilowattHour
    +estimateYearlyUpstreamEmissions(deviceCount: number): KgCo2e
    +estimateYearlyUpstreamEmissionsForLifespan(deviceCount: number, lifespan: Year) KgCo2e
  }

  class AverageDeviceType {
    -averagePower: Watt
    -averageYearlyUsage: Hour
    -averageEmbodiedCarbon: KgCo2e
    -averageLifespan: Year
    +constructor(...shares: DeviceShare[])
    +estimateYearlyEnergy(deviceCount: number) KilowattHour
    +estimateEnergy(usage: Hour) KilowattHour
    +estimateYearlyUpstreamEmissions(deviceCount: number): KgCo2e
    +estimateYearlyUpstreamEmissionsForLifespan(deviceCount: number, lifespan: Year) KgCo2e
  }

  class DeviceShare {
    +device: DeviceType
    +percentage: number
  }

  DeviceType <|-- AverageDeviceType
  AverageDeviceType ..> DeviceShare
  DeviceShare ..> DeviceType
```

The `DeviceType` class is not exported but performs calculations based on average power, usage, embodied carbon, and lifespan.

### Exported variables

#### `laptop: DeviceType`
#### `desktop: DeviceType`
#### `server: DeviceType`
#### `network: DeviceType`
#### `mobile: DeviceType`
#### `tablet: DeviceType`
#### `monitor: DeviceType`
#### `averagePersonalComputer: AverageDeviceType`

Exported to allow use in various calculations.

---

### Exported classes

#### `AverageDeviceType`

Exported to allow an average device to be created based on mobile end-user ratio.

## estimate-energy-emissions

### Exported functions

#### `estimateEnergyEmissions()`

Estimate emissions from energy used in a location.

##### Parameters

`energy: KilowattHour` - Amount of energy used.
`location: WorldLocation` - The World Location where the energy was used for Carbon Intensity.

##### Returns

`KgCo2e` - Kg of CO2e emitted via energy use.

---

#### `getCarbonIntensity()`

Exported to get Carbon Intensity in unit that [CO2.js](https://www.thegreenwebfoundation.org/co2-js/) library requires.

##### Parameters

`location: WorldLocation` - The World Location for Carbon Intensity.

##### Returns

`gCo2ePerKwh` - g of CO2e emitted per kWh of energy used.
