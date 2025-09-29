import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from '../../../utils/form.util';

@Component({
  selector: 'app-switches-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './switches-page.component.html',
})
export class SwitchesPageComponent {
  public fb = inject(FormBuilder);
  formUtil = FormUtil;

  myForm: FormGroup = this.fb.group({
    gender: [, [Validators.required]],
    wantNotification: [true],
    termsAndConditions: [false, [Validators.requiredTrue]],
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
  }

}
