import { Component, inject, input, OnInit } from '@angular/core';
import { Product } from '@products/interfaces/product-response.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();

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

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    console.log(this.productForm.value);
  }
}
