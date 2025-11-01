import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ProductTable } from "@products/components/product-table/product-table";
import { Product } from '@products/interfaces/product-response.interface';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { tap } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  paginationService = inject(PaginationService);
  product = signal<Product[] | null>(null);
  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({ page: this.paginationService.currentPage(), limit: this.productsPerPage() }),
    stream: ({ params }) => {
      return this.productsService.getAllProducts({
        offset: (params.page - 1) * params.limit,
        limit: params.limit,
      }).pipe(
        tap((response) => {
          this.product.set(response.products);
        })
      );
    },
  });

  onProductsPerPageChange(value: number): void {
    this.productsPerPage.set(value);
    this.router.navigate([], { queryParams: { page: 1 }, queryParamsHandling: 'merge' });
  }
 }
