import { Pipe, PipeTransform } from '@angular/core';
import { CostRange } from '../carbon-estimator';

export const currencyFormat = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol',
  notation: 'compact',
});

@Pipe({
  name: 'formatCostRange',
  standalone: true,
})
export class FormatCostRangePipe implements PipeTransform {
  transform(range: CostRange): string {
    return `${currencyFormat.format(range.min)} - ${currencyFormat.format(range.max)}`;
  }
}
