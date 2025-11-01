import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Product, Gender, Size } from '@products/interfaces/product-response.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();
  productService = inject(ProductsService);
  router = inject(Router);

  wasSaved = signal(false);

  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[], Validators.required],
    images: [[], Validators.required],
    tags: [''],
    gender: ['unisex', [Validators.required, Validators.pattern('^(men|women|kid|unisex)$')]],
  })

  readonly sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];

  private get productValue(): Product {
    return this.product();
  }

  get selectedSizes(): Size[] {
    return (this.productForm.get('sizes')?.value ?? []) as Size[];
  }

  ngOnInit() {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
  const normalized = this.mapProductToForm(formLike ?? this.productValue);
  this.productForm.reset(normalized as any);
  }

  private mapProductToForm(product: Partial<Product>) {
    return {
      title: product.title ?? '',
      description: product.description ?? '',
      slug: product.slug ?? '',
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      sizes: product.sizes ?? [],
      images: product.images ?? [],
      tags: product.tags?.join(', ') ?? '',
      gender: (product.gender as Gender) ?? Gender.Unisex,
    };
  }

  onSizeToggle(size: string) {
    const currentSizes: string[] = this.productForm.value.sizes || [];
    const next = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
  this.productForm.patchValue({ sizes: next } as any);
  }

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const fileNames = files.map(f => f.name);

  this.productForm.patchValue({ images: fileNames } as any);
  }

  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue() as any;
    const productPartial: Partial<Product> = {
      title: formValue.title ?? '',
      description: formValue.description ?? '',
      slug: formValue.slug ?? '',
      price: formValue.price ?? 0,
      stock: formValue.stock ?? 0,
      sizes: formValue.sizes ?? [],
      images: formValue.images ?? [],
      gender: (formValue.gender as Gender) ?? Gender.Unisex,
      tags: this.parseTags(formValue.tags ?? ''),
    };

    const id = this.productValue.id;

    try {
      if (id === 'new') {
        const product = await firstValueFrom(this.productService.createProduct(productPartial));

        this.wasSaved.set(true);
        await new Promise((res) => setTimeout(res, 1500));
        await this.router.navigate(['/admin/product', product.id]);
        return;
      }

      await firstValueFrom(this.productService.updateProduct(id, productPartial));
      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 3000);
    } catch (err) {
      console.error('Error saving product', err);
    }
  }

  private parseTags(tags?: string): string[] {
    if (!tags) return [];
    return tags
      .toLocaleLowerCase()
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  }
}
