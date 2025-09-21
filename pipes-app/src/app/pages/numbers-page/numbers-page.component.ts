import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-numbers-page',
  imports: [DecimalPipe, PercentPipe, CurrencyPipe,],
  templateUrl: './numbers-page.component.html',
})
export class NumbersPageComponent {
  totalSales = signal(2_567_789.5567);
  percentage = signal(0.4856);
  totalPrice = signal(3_567_584.774);
  tax = signal(0.19);
  discount = signal(0.1);
}
