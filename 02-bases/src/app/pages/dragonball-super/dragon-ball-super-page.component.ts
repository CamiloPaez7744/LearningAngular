import { Component, computed, signal } from '@angular/core';
import { CharacterListComponent } from "../../components/dragon-ball/character-list/character-list.component";
import { AddCharacterComponent } from "../../components/dragon-ball/add-character/add-character.component";

interface Character {
  id: number;
  name: string;
  power: number;
}

@Component({
  templateUrl: './dragon-ball-super-page.component.html',
  imports: [CharacterListComponent, AddCharacterComponent],
})
export class DragonBallSuperPageComponent {
  name = signal('Gohan');
  power = signal(8400);

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9500 },
    { id: 2, name: 'Vegeta', power: 8500 },
    { id: 3, name: 'Trunks', power: 5000 },
    { id: 4, name: 'Piccolo', power: 6500 },
    { id: 4, name: 'Yamcha', power: 3000 },
  ]);

  addCharacter(character: Character) {
    if (this.characters().some((c) => c.name === character.name)) return;
    this.characters.update((chars) => [...chars, character]);
  }
}
