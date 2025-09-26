import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from '../../../utils/form.util';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  private fb = inject(FormBuilder);
  formUtil = FormUtil;

  myForm: FormGroup = this.fb.group({
    name: ['',/** Validators synchronous */[Validators.required, Validators.minLength(3)], /** Validators asynchronous */[]],
    price: [0, [Validators.min(10), Validators.required]],
    inStorage: [0, [Validators.min(0), Validators.required]],
  });

  onSave(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);
    this.myForm.reset(
      {
        price: 0,
        inStorage: 0,
      }
    );
  }

  // isValidField(field: string): boolean | null {
  //   return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  // }

  // getFieldError(field: string): string | null {
  //   if (!this.myForm.controls[field]) return null;

  //   const errors = this.myForm.controls[field].errors || {};
  //   for (const key of Object.keys(errors)) {
  //     switch (key) {
  //       case 'required':
  //         return 'This field is required.';
  //       case 'minlength':
  //         return `Minimum ${errors['minlength'].requiredLength} characters.`;
  //       case 'min':
  //         return `The minimum value is ${errors['min'].min}.`;
  //     }
  //   }

  //   return null;
  // }

  // myForm = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // });
}
