# Assumptions and Limitations

The **Tech Carbon Estimator** tool is designed to give a high-level overview of the possible areas of carbon impact within your IT estate. We use a minimal number of questions to present this view, so we must make some assumptions based on that, which we list here for clarity. Where there are aspects that cannot be covered by this methodology, we also call out its limitations.

## Assumptions

### Time period

The estimation is based on a typical year’s utilization. Where relevant for energy calculations, we use different typical numbers of hours for different classes of hardware:

- Desktops, Laptops and Monitors – These both assume **8** hours of daily usage, for **230** days a year.
- Servers and Networking Devices – These both assume 24 hours of daily usage, for 365 days a year.

Obviously, this may not match up with your organisation's usage, either due to different working hours or whether equipment is turned off during out of work hours.

### Number of Employee Devices

Without a specified number of devices, we estimate based on the number of employees and the proportion of desktops to laptops specified. This may be an overestimate if a significant number of employees are not provided with devices, or an underestimate if they typically have more than one.

### Number of Servers

Without a specified number of servers, we give an initial estimate based on the 10% of the number of employees. This is reduced based on the percentage of cloud services that you report you make use of.

### Number of Networking Devices

At present, we estimate a number of large networking devices based on the combined number of desktop devices and servers, applying a **50%** ratio.

### Power consumption

Each class of device is given an average power demand, based on data compiled from multiple sources and our own research. The figures are rounded to the nearest Watt:

| Device Type | Average Power (Watts) |
| ----------- | --------------------- |
| Laptop      | 17                    |
| Desktop     | 72                    |
| Server      | 400                   |
| Network     | 150                   |
| Mobile      | 1                     |
| Tablet      | 3                     |
| Monitor     | 30                    |

### Carbon Intensity

We make use of the latest available Carbon Intensity figures from the [Ember Data Explorer](https://ember-climate.org/data/data-tools/data-explorer/) for the regions we make available. At present these are:

| World Location | Carbon Intensity (Kg CO2e/kWh) |
| -------------- | ------------------------------ |
| Global         | 0.494                          |
| United States  | 0.41                           |
| Europe         | 0.33                           |
| United Kingdom | 0.238                          |

### Upstream Emissions

Each class of device is given an average amount of embodied carbon and a lifespan, based on averages taken from manufacturer provided Product Carbon Footprint documentation. At present these are:

| Device Type | Embodied Carbon (Kg Co2e) | Lifespan (Years) |
| ----------- | ------------------------- | ---------------- |
| Laptop      | 230                       | 4                |
| Desktop     | 400                       | 4                |
| Server      | 1450                      | 4                |
| Network     | 1000                      | 4                |
| Mobile      | 54                        | 3                |
| Tablet      | 134                       | 3                |
| Monitor     | 350                       | 6                |

### Cloud Services

We have derived a rough figure to give a ratio from US dollars spent to kWh of energy used in data centres. By combining a list of AWS EC2 instance prices with power data from the [Cloud Carbon Coefficients](https://github.com/cloud-carbon-footprint/cloud-carbon-coefficients/blob/main/data/aws-instances.csv) notebook, we calculated a kWh per $ figure for each entry in the price list. This uses the Wattage reported under 50% load, the same default utilisation used by the Cloud Carbon Footprint tool. Some of the results from this were as follows:

| Figure             | Value (kWh per $) |
| ------------------ | ----------------- |
| Mean               | 0.155819          |
| Median             | 0.097193          |
| Standard Deviation | 0.516504          |
| Minimum            | 0.007634          |
| Maximum            | 48.9952           |

Clearly there is a large amount of variation here, with a wide variety of pricing options available based on lease period and upfront payment etc. This also only covers a single service that AWS provides but could be seen as the simplest available, with the most direct link between pricing and kWh of power available. Other services may cost more based on the additional management that AWS performs, which does not necessarily translate into an increase in power used. For these reasons we have decided to use the mean figure of ~0.156 kWh/$ as the method of transforming cloud costs to kWh for the purposes of Cloud Emissions.

The estimated kWh of cloud usage is combined with an average Cloud PUE figure of 1.18 and the relevant Carbon Intensity figure for the selected Cloud Location to give a final kg CO2e estimation. We also apply a simple 1.25 ratio to the final carbon estimation to account for the embodied carbon of devices - acknowledged to generally follow an 80/20% split in server hardware.

### Downstream Emissions

At present we focus on the downstream impact of web based services, estimating an amount time spent in hours and of Data transferred in Gb per month. To do this we have collated some average usage figures for different kinds of web services from online sources and our own research:

| Type         | Average User Time (hours/month) | Average User Data (Gb/month) |
| ------------ | ------------------------------- | ---------------------------- |
| Information  | 0.016666667                     | 0.000781                     |
| E-Commerce   | 0.1                             | 0.01656                      |
| Social Media | 16.33333333                     | 4.4443                       |
| Streaming    | 22.14285714                     | 10.3912                      |
| Average      | 9.648214286                     | 3.71321025                   |

These figures are combined with the provided Monthly active user number and service type to estimate figures for a full year.

#### Network Data Transfer

Our outgoing network data estimation makes use of the [CO2.js](https://developers.thegreenwebfoundation.org/co2js/overview/) library, specifically using the [Sustainable Web Design](https://sustainablewebdesign.org/calculating-digital-emissions/) model. This methodology is often used to give an overview of the carbon emissions of an entire website but it can also focus on single components like Network infrastructure. We felt that this was the most appropriate method to use at this point in time, due to the difficulties involved in making a more specific estimation of the Downstream Network infrastructure used by an organisation.

#### End-User Devices

We combine device information to give an average power demand for a typical user of web services. Mobile phones are called out specifically as a separate percentage, due to their relatively low power demand. This is also an aspect that we want to break down further as there can be significant differences based on the method of data transfer (Wifi vs 3/4/5G).

## Limitations

Here are some aspects of the Tech Carbon Standard, which the tool currently does not consider.

### Upstream Emissions

#### Off the Shelf Software

This is a tough area to estimate even with a detailed breakdown of the commercial software that an organisation makes use of. It is uncommon for organisations to publish the carbon footprint information for a piece of software. Even if this was available, there is still a question of how to apportion a given total to an organisation making use of it.

Without this kind of detailed information, we could only make limited guesses about the typical software that might be used by an organisation of a given size within a specific industry. At this point in time, we do not feel that we have enough information to make an educated guess at its impact, although we welcome any contributions towards taking this into account.

### Operational Emissions - Direct

#### Generators

In the interests of using information that should be easy to source, we have omitted questions about whether your data centers have fossil fuel based generators and how often they are used. This is something we could investigate further in future, either via new questions or by using more fine-grained location data to estimate an average amount of electricity network downtime that might be typical and what effect that might have on your average Carbon Intensity.

### Operational Emissions - Indirect

#### SaaS

Like Off the shelf and open source software, this can be a difficult area to estimate even with the knowledge of the software services in use. This aspect is excluded at this point in time but we hope to consider more in future. Some aspects can be similar to Cloud Services that follow best practices.

#### Managed Services

We currently do not make a distinction between on-premises data centers and those ran by a third party.
