import { Pipe, PipeTransform } from '@angular/core';
import { Color, ColorMap } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroMapColor'
})

export class HeroMapColorPipe implements PipeTransform {
  transform(value: Color,): string {
    return ColorMap[value] || '';
  }
}
