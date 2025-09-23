import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroFilter'
})

export class HeroFilterPipe implements PipeTransform {
  transform(value: Hero[], searchTerm: string): Hero[] {
    if (!searchTerm) return value;

    searchTerm = searchTerm.toLowerCase();

    return value.filter(hero => {
      return (
        hero.name.toLowerCase().includes(searchTerm) ||
        hero.creator.toString().includes(searchTerm)
      );
    });
  }
}
