# Assumptions and Limitations

The **Tech Carbon Estimator** tool is designed to give a high-level overview of the possible areas of carbon impact within your IT estate. We use a minimal number of questions to present this view, so we must make some assumptions based on that, which we list here for clarity. Where there are aspects that cannot be covered by this methodology, we also call out its limitations.

## Assumptions

### Time period

The estimation is based on a typical year’s utilization. Where relevant for energy calculations, we use different typical numbers of hours for different classes of hardware:

- Desktops, Laptops and Monitors – These both assume **8** hours of daily usage, for **230** days a year.
- Servers and Networking Devices – These both assume 24 hours of daily usage, for 365 days a year.

Obviously, this may not match up with your company’s usage, either due to different working hours or whether equipment is turned off during out of work hours.

### Number of Employee Devices

Without a specified number of devices, we estimate based on the number of employees.

### Number of Servers

Without a specified number of servers, we estimate based on the number of employee devices/customers.

### Number of Networking Devices

Based on number of desktop devices and servers, apply **50%** ratio. *Reference DS Smith numbers?*

### Power consumption

*List device power type assumptions and why*

### Carbon Intensity

*List carbon intensity figures used for our sub regions*

### Embodied Carbon

Using an 20/80 ratio for the operational/embodied emissions of end user hardware, and the reverse 80/20 for higher powered items like Servers and large Networking Devices.

### Cloud Energy

*Details of our method of approximating average cloud energy from cost*

### Outgoing Network data

*Details of our method of approximating data transfer from customer numbers and how the SWD method can be modified to just look at external components*

## Limitations

Here are some aspects of the Tech Carbon Standard, which the tool currently does not consider.

### Commercial Off the Shelf (COTS) Software

This is a tough area to estimate even with a detailed breakdown of the commercial software that a company makes use of. Do these companies make their carbon footprint information available and how would you apportion these to your own software purchases.

Without this kind of detailed information, we could only make limited guesses about the typical software that might be used by a company of a given size within a specific industry. At this point in time, we do not feel that we have enough information to make an educated guess at its impact, although we welcome any contributions towards taking this into account.

### Generators

In the interests of using information that should be easy to source, we have omitted questions about whether your data centers have fossil fuel based generators and how often they are used. This is something we could investigate further in future, either via new questions or by using more fine-grained location data to estimate an average amount of electricity network downtime that might be typical and what effect that might have on your average Carbon Intensity.

### Saas

Like COTS software, this can be a difficult area to estimate even with the knowledge of the software services in use. This aspect is excluded at this point in time. *or limited to some high profile sources, Office 365 etc.*

### Managed Services

Currently do not make a distinction between on-premises data centers and those ran by a third party. *unless we ask this as a specific question?*
