import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  private fb = inject(FormBuilder);

  myForm = this.fb.group({
    name: ['',/** Validators synchronous */ [Validators.required, Validators.minLength(3)], /** Validators asynchronous */ []],
    price: [0, [Validators.min(10), Validators.required]],
    inStorage: [0, [Validators.min(0), Validators.required]],
  });

  // myForm = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // });
}
