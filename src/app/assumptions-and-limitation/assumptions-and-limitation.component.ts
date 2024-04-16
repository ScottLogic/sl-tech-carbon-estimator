import { AfterContentInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { CLOUD_AVERAGE_PUE, ON_PREMISE_AVERAGE_PUE } from '../estimation/constants';
import { siteTypeInfo } from '../estimation/estimate-downstream-emissions';
import { PurposeOfSite, purposeOfSiteArray } from '../types/carbon-estimator';
import { DecimalPipe } from '@angular/common';

const userDescriptions: Record<PurposeOfSite, string> = {
  information: 'Information',
  eCommerce: 'E-Commerce',
  socialMedia: 'Social Media',
  streaming: 'Streaming',
  average: 'Average',
};

@Component({
  selector: 'sl-assumptions-and-limitation',
  standalone: true,
  templateUrl: './assumptions-and-limitation.component.html',
  imports: [DecimalPipe],
})
export class AssumptionsAndLimitationComponent implements AfterContentInit {
  @Output() public closeEvent = new EventEmitter<boolean>();
  readonly ON_PREMISE_AVERAGE_PUE = ON_PREMISE_AVERAGE_PUE;
  readonly CLOUD_AVERAGE_PUE = CLOUD_AVERAGE_PUE;
  readonly siteTypeInfo = purposeOfSiteArray.map(purpose => ({
    type: userDescriptions[purpose],
    time: siteTypeInfo[purpose].averageMonthlyUserTime,
    data: siteTypeInfo[purpose].averageMonthlyUserData,
  }));

  @ViewChild('assumptionsLimitation', { static: true }) public assumptionsLimitation!: ElementRef<HTMLDivElement>;

  public ngAfterContentInit(): void {
    this.assumptionsLimitation.nativeElement.focus();
  }

  public onClose(hasFocus = true): void {
    this.closeEvent.emit(hasFocus);
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onEscKeydown(): void {
    const hasFocus = this.assumptionsLimitation.nativeElement.contains(document.activeElement);
    this.onClose(hasFocus);
  }
}
