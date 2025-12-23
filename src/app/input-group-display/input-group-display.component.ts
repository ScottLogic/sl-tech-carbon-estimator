import { Component, computed, input } from '@angular/core';
import { Downstream, OnPremise, Upstream } from '../types/carbon-estimator';
import { Saas } from '../features/saas/components/saas.constants';
import { Cloud } from '../features/cloud/services/cloud-form.service';

@Component({
  selector: 'input-group-display',
  imports: [],
  templateUrl: './input-group-display.component.html',
})
export class InputGroupDisplay {
  public inputGroup = input<Upstream | OnPremise | Cloud | Downstream | Saas | Record<string, never>>();
  public group = input<string>();

  public displayEntries = computed(() => {
    let entries = [] as [string, string | number | boolean][];

    if (this.group() === 'Cloud') {
      entries.push([
        'Min Cloud Bill',
        (this.inputGroup() as Cloud).monthlyCloudBill.min.toLocaleString('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }),
      ]);

      entries.push([
        'Max Cloud Bill',
        (this.inputGroup() as Cloud).monthlyCloudBill.max.toLocaleString('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }),
      ]);

      entries.push(['Cloud Percentage', (this.inputGroup() as Cloud).cloudPercentage.toString() + '%']);

      entries.push(['Cloud Location', (this.inputGroup() as Cloud).cloudLocation]);

      entries.push(['No Cloud Services', (this.inputGroup() as Cloud).noCloudServices]);
    } else if (this.group() === 'Saas') {
      entries.push(['Use Microsoft 365', (this.inputGroup() as Saas).microsoft365.useMicrosoft365]);
      entries.push(['Users', (this.inputGroup() as Saas).microsoft365.organisationUserCount]);
    } else {
      entries = Object.entries(this.inputGroup() ?? {});
      entries.forEach(entry => {
        // convert camelCase to Title Case for display
        entry[0] = entry[0].replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      });
    }

    return entries;
  });
}
