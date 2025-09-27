import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtil {
  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$';

  static isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  static isValidFieldInArray(FormArray: FormArray, index: number): boolean | null {
    return FormArray.at(index).errors && FormArray.at(index).touched;
  }

  static getTextError(error: ValidationErrors): string | null {
    for (const key of Object.keys(error)) {
      switch (key) {
        case 'required':
          return 'This field is required.';
        case 'email':
          return 'The email is not valid.';
        case 'minlength':
          return `Minimum ${error['minlength'].requiredLength} characters.`;
        case 'min':
          return `The minimum value is ${error['min'].min}.`;
      }

    }
    return null;
  }

  static getFieldError(form: FormGroup, field: string, message?: string): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};
    const errorText = FormUtil.getTextError(errors);
    if (errorText) return errorText;
    if (message) return message;
    return null;
  }

  static getFieldErrorInArray(FormArray: FormArray, index: number): string | null {
    if (!FormArray.at(index)) return null;
    const errors = FormArray.at(index).errors || {};
    return FormUtil.getTextError(errors);
  }
}
