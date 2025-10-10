import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';

import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  private productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  route = inject(ActivatedRoute);
  gender = toSignal(this.route.params.pipe(map(({ gender }) => gender)));

  products = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() }),
    stream: ({ params }) => {
      return this.productsService.getAllProducts({
        gender: params.gender,
        offset: (params.page - 1) * 10,
        limit: 10,
      });
    }
  });
}
