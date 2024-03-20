import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'sl-assumptions-and-limitation',
  standalone: true,
  imports: [MarkdownModule],
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
