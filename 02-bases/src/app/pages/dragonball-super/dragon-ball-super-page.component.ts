import { Component, inject } from '@angular/core';
import { CharacterListComponent } from "../../components/dragon-ball/character-list/character-list.component";
import { AddCharacterComponent } from "../../components/dragon-ball/add-character/add-character.component";
import { DragonBallService } from '../../services/dragon-ball.service';

@Component({
  templateUrl: './dragon-ball-super-page.component.html',
  imports: [CharacterListComponent, AddCharacterComponent],
})
export class DragonBallSuperPageComponent {
  public dragonBallService = inject(DragonBallService);

}
