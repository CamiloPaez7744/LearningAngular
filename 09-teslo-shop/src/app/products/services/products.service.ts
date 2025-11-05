import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@env/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product-response.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const EMPTY_PRODUCT: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  constructor() { }
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getAllProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const cacheKey = `limit=${limit}&offset=${offset}&gender=${gender}`;
    if (this.productsCache.has(cacheKey)) {
      return of(this.productsCache.get(cacheKey)!);
    }
    return this.http.get<ProductsResponse>(`${BASE_URL}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    }).pipe(
      tap(console.log),
      tap((response) => {
        this.productsCache.set(cacheKey, response);
      })
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${idSlug}`).pipe(
      tap(console.log),
      tap((response) => {
        this.productCache.set(idSlug, response);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(EMPTY_PRODUCT);
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${id}`).pipe(
      tap(console.log),
      tap((response) => {
        this.productCache.set(id, response);
      })
    );
  }

  updateProduct(id: string, product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.uploadImages(imageFileList)
      .pipe(
        map((imageFileNames) => ({
          ...product,
          images: [...(product.images || []), ...imageFileNames],
        })),
        switchMap((productWithImages) => 
          this.http.patch<Product>(`${BASE_URL}/products/${id}`, productWithImages)
        ),
        tap((updatedProduct) => {
          this.updateProductCache(id, updatedProduct);
        })
      );
    // return this.http.patch<Product>(`${BASE_URL}/products/${id}`, product).pipe(
    //   tap((updatedProduct) => {
    //     this.updateProductCache(id, updatedProduct);
    //   })
    // );
  }

  updateProductCache(id: string, product: Partial<Product>) {
    const existingProduct = this.productCache.get(id);
    if (existingProduct) {
      this.productCache.set(id, { ...existingProduct, ...product });
    }
    const productsArrayKeys = Array.from(this.productsCache.keys());
    productsArrayKeys.forEach(key => {
      const productsResponse = this.productsCache.get(key);
      if (productsResponse) {
        const productIndex = productsResponse.products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
          productsResponse.products[productIndex] = { ...productsResponse.products[productIndex], ...product };
        }
      }
    });
  }

  createProduct(product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    console.log('Creating product:', product);

    return this.uploadImages(imageFileList)
      .pipe(
        map((imageFileNames) => ({
          ...product,
          images: [...(product.images || []), ...imageFileNames],
        })),
        switchMap((productWithImages) =>
          this.http.post<Product>(`${BASE_URL}/products`, productWithImages)
        ),
        tap((createdProduct) => {
          this.updateProductCache(createdProduct.id, createdProduct);
        })
      );

    // return this.http.post<Product>(`${BASE_URL}/products`, product)
    //   .pipe(
    //     tap((createdProduct) => {
    //       this.updateProductCache(createdProduct.id, createdProduct);
    //     })
    //   );
  }

  uploadImages( images?: FileList): Observable<string[]> { 
    if (!images || images.length === 0) return of([]);
    const uploadObservables: Observable<string>[] = Array.from(images).map((imageFile) => {
      return this.uploadImage(imageFile);
    });
    return forkJoin(uploadObservables);
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<{fileName: string}>(`${BASE_URL}/files/product`, formData).pipe(
      map(response => response.fileName)
    );
  }

}
