import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImage',
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    if (value === null) return './assets/images/no-image.jpg';
    if (Array.isArray(value)) {
      if (value.length === 0) return './assets/images/no-image.jpg';
      return `${BASE_URL}/files/product/${value[0]}`;
    }
    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }
    return `${BASE_URL}/files/product/${value}`;
  }
}
