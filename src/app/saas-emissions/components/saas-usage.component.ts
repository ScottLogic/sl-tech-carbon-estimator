import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: "saas-usage",
  templateUrl: "saas-usage-form.component.html",
  imports: [CommonModule],
})
export class SaasUsageComponent {

  public useSaaS = false;

  public numberOfUsers?: number;
}