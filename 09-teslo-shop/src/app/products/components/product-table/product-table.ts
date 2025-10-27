import { Component, input } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductImagePipe } from "../../pipes/product-image.pipe";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'product-table',
  imports: [RouterLink, CurrencyPipe, ProductImagePipe],
  templateUrl: './product-table.html',
})
export class ProductTable {
  products = input.required<Product[]>();
}
