import { effect, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';

function loadFromLocalStorage(): Character[] {
  const data = localStorage.getItem('db-characters');
  return data ? JSON.parse(data) : [];
}

@Injectable({providedIn: 'root'})
export class DragonBallService {
  constructor() { }
  characters = signal<Character[]>(loadFromLocalStorage());

  addCharacter(character: Character) {
    if (this.characters().some((c) => c.name === character.name)) return;
    this.characters.update((chars) => [...chars, character]);
  }

  saveToLocalStorage = effect(() => {
    localStorage.setItem('db-characters', JSON.stringify(this.characters()));
  });
}
