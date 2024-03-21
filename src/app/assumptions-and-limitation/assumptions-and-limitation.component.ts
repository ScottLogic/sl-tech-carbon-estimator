import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'sl-assumptions-and-limitation',
  standalone: true,
  templateUrl: './assumptions-and-limitation.component.html',
})
export class AssumptionsAndLimitationComponent {
  @Output() public closeEvent = new EventEmitter<void>();

  public onClose(): void {
    this.closeEvent.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onEscKeydown(): void {
    this.onClose();
  }
}
