import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { Product, ProductsResponse } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private productsService = inject(ProductsService);
  product = signal<Product[] | null>(null);

  productsResource = rxResource({
    params: () => ({  }),
    stream: ({ params }) => {
      return this.productsService.getAllProducts({}).pipe(
        tap((response) => {
          this.product.set(response.products);
        })
      );
    },
  });
}
