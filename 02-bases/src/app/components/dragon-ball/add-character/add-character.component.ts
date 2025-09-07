import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragon-ball-add-character',
  imports: [],
  templateUrl: './add-character.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCharacterComponent {
  name = signal('');
  power = signal(0);

  newCharacter = output<Character>();

  powerClasses = computed(() => {
    return (power: number) => {
      if (power > 9000) return 'bg-red-600';
      if (power < 6000) return 'bg-yellow-600';
      return 'bg-green-600';
    };
  });

  addCharacter() {
    if (this.name().length === 0) return;
    if (this.power() <= 0) return;

    const newCharacter: Character = {
      id: Math.floor(Math.random() * 10000),
      name: this.name(),
      power: this.power(),
    };
    this.newCharacter.emit(newCharacter);
    this.resetFields();
  }

  resetFields() {
    this.name.set('');
    this.power.set(0);
  }
}
