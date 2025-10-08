import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  public product = {
    id: 1,
    title: 'Product Title',
    images: ['https://angular.io/assets/images/logos/angular/angular.png'],
    price: 123,
    slug: 'product-title'
  };
}
