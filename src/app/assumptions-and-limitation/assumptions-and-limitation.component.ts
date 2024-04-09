import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CLOUD_AVERAGE_PUE, ON_PREMISE_AVERAGE_PUE } from '../estimation/constants';

@Component({
  selector: 'sl-assumptions-and-limitation',
  standalone: true,
  templateUrl: './assumptions-and-limitation.component.html',
})
export class AssumptionsAndLimitationComponent {
  @Output() public closeEvent = new EventEmitter<void>();
  readonly ON_PREMISE_AVERAGE_PUE = ON_PREMISE_AVERAGE_PUE;
  readonly CLOUD_AVERAGE_PUE = CLOUD_AVERAGE_PUE;

  public onClose(): void {
    this.closeEvent.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onEscKeydown(): void {
    this.onClose();
  }
}
