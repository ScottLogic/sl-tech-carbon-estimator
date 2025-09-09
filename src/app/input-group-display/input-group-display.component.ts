import { Component, computed, input } from '@angular/core';
import { Cloud, Downstream, OnPremise, Upstream } from '../types/carbon-estimator';
import { entries } from 'lodash-es';

@Component({
  selector: 'input-group-display',
  imports: [],
  templateUrl: './input-group-display.component.html',
})
export class InputGroupDisplay {

  public inputGroup = input<Upstream | OnPremise | Cloud | Downstream | {}>();
  public group = input<string>();

  public displayEntries = computed(() => {
    let entries = [] as [string, string | number | boolean][];

    if (this.group() === 'Cloud') {
      entries.push([
        'Min Cloud Bill',
        (this.inputGroup() as Cloud).monthlyCloudBill.min.toLocaleString(
          'en-GB', { style: 'currency', currency: 'GBP' }
        )
      ]);

      entries.push([
        'Max Cloud Bill',
        (this.inputGroup() as Cloud).monthlyCloudBill.max.toLocaleString(
          'en-GB', { style: 'currency', currency: 'GBP' }
        )
      ]);

      entries.push([
        'Cloud Percentage',
        (this.inputGroup() as Cloud).cloudPercentage.toString() + '%'
      ]);

      entries.push(['Cloud Location', (this.inputGroup() as Cloud).cloudLocation]);

      entries.push([
        'No Cloud Services',
        (this.inputGroup() as Cloud).noCloudServices
      ]);
    } else {
      entries = Object.entries(this.inputGroup() ?? {});
      entries.forEach(entry => {
        // convert camelCase to Title Case for display
        entry[0] =
          entry[0]
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
      })
    }

    return entries;
  });

}
