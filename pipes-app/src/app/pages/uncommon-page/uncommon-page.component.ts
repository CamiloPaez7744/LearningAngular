import { Component, signal } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { I18nSelectPipe } from '@angular/common';

const client1 = {
  name: 'Bruce',
  gender: 'Male',
  age: 35,
  address: 'Ottawa, Canada'
}

const client2 = {
  name: 'Diana',
  gender: 'Female',
  age: 25,
  address: 'New York, USA'
}

@Component({
  selector: 'app-uncommon-page',
  imports: [CardComponent, I18nSelectPipe],
  templateUrl: './uncommon-page.component.html',
})
export class UncommonPageComponent {
  // i18nSelect
  client = signal(client1);
  changeClient(): void {
    this.client.set(this.client() === client1 ? client2 : client1);
  }

  invitationMap = {
    'Male': 'Sr.',
    'Female': 'Sra.',
  }
 }
