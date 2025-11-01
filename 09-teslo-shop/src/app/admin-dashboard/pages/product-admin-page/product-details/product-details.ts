import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();
  productService = inject(ProductsService);
  router = inject(Router);

  fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[''], Validators.required],
    images: [[''], Validators.required],
    tags: [''],
    gender: ['unisex', [Validators.required, Validators.pattern('^(men|women|kid|unisex)$')]],
  })

  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit() {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({
      tags: formLike.tags?.join(', '),
    });
  }

  onSizeToggle(size: string) {
    const currentSizes: string[] = this.productForm.value.sizes || [];
    if (currentSizes.includes(size)) {
      this.productForm.patchValue({
        sizes: currentSizes.filter(s => s !== size),
      });
    } else {
      this.productForm.patchValue({
        sizes: [...currentSizes, size],
      });
    }
  }

  onFilesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const fileNames = files.map(f => f.name);

    this.productForm.patchValue({ images: fileNames });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.value;
    const productPartial: Partial<Product> = {
      ...formValue as any,
      tags: formValue.tags
        ?.toLocaleLowerCase()
        .split(',')
        .map(t => t.trim()) ?? [],
    };

    console.log(this.product().id);

    if (this.product().id === 'new') {
      this.productService.createProduct(productPartial).subscribe({
        next: (createdProduct) => {
          this.router.navigate(['/admin/product', createdProduct.id]);
          console.log('Product created successfully:', createdProduct);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
      console.log(productPartial);
      return;
    }

    this.productService.updateProduct(this.product().id, productPartial).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated successfully:', updatedProduct);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });

    console.log(productPartial);
  }
}
