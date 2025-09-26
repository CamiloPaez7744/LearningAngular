import { FormGroup } from '@angular/forms';

export class FormUtil {
  static isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  static getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required.';
        case 'minlength':
          return `Minimum ${errors['minlength'].requiredLength} characters.`;
        case 'min':
          return `The minimum value is ${errors['min'].min}.`;
      }
    }

    return null;
  }
}
