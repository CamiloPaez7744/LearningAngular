import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  templateUrl: './dragon-ball-page.component.html',
  imports: [NgClass],
})
export class DragonBallPageComponent {
  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9500 },
    { id: 2, name: 'Vegeta', power: 8500 },
    { id: 3, name: 'Trunks', power: 5000 },
    { id: 4, name: 'Piccolo', power: 6500 },
  ]);

  powerClasses = computed(() => {
    return (power: number) => {
      if (power > 9000) return 'bg-red-600';
      if (power < 6000) return 'bg-yellow-600';
      return 'bg-green-600';
    };
  });

  addCharacter(name: string, power: number) {
    const id = this.characters().length + 1;
    this.characters.set([...this.characters(), { id, name, power }]);
  }
}
