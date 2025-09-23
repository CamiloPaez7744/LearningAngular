import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroColorCase'
})

export class HeroColorCasePipe implements PipeTransform {
  transform(value: Color): string {
    return Color[value];
  }
}
