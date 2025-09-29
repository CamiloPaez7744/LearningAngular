import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleCase'
})

export class ToggleCasePipe implements PipeTransform {
  transform(value: string, upper: boolean): string {
    if (!value) return value;
    return value.split('').map(char => {
      return upper ? char.toUpperCase() : char.toLowerCase();
    }).join('');
  }
}
