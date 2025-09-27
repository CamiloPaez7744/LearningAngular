import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from '../../../utils/form.util';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  public fb = inject(FormBuilder);
  formUtil = FormUtil;

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtil.namePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtil.emailPattern)]],
    username: ['', [Validators.required, Validators.pattern(FormUtil.notOnlySpacesPattern)]],
    password: ['', [Validators.required, Validators.pattern(FormUtil.passwordPattern)]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
  }
}
