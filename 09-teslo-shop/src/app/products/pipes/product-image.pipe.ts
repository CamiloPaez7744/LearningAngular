import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (!value) return './assets/images/no-image.png';
    if (Array.isArray(value)) {
      if (value.length === 0) return './assets/images/no-image.png';
      return `${BASE_URL}/files/product/${value[0]}`;
    }
    return `${BASE_URL}/files/product/${value}`;
  }
}
