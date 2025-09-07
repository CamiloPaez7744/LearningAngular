import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragon-ball-character-list',
  imports: [],
  templateUrl: './character-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterListComponent {
  characters = input.required<Character[]>();
  listName = input.required<string>();
}
