import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { Product, ProductsResponse } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { map, of, tap } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  product = signal<Product[] | null>(null);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage() }),
    stream: ({ params }) => {
      return this.productsService.getAllProducts({
        offset: (params.page - 1) * 10,
        limit: 10,
      }).pipe(
        tap((response) => {
          this.product.set(response.products);
        })
      );
    },
  });
}
