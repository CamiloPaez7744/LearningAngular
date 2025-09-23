import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroSortBy'
})

export class HeroSortByPipe implements PipeTransform {
  transform(value: Hero[], property: keyof Hero | null): Hero[] {
    if (!property) return value;
    return value.sort((a, b) => (a[property] > b[property] ? 1 : -1));
  }
}
