import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canFlyCase'
})

export class canFlyCasePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Can Fly' : 'Cannot Fly';
  }
}
