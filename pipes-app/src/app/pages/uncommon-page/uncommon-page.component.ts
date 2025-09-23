import { Component, signal } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { AsyncPipe, I18nPluralPipe, I18nSelectPipe, JsonPipe, KeyValuePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { interval, tap } from 'rxjs';

const client1 = {
  id: 1,
  name: 'Bruce',
  gender: 'Male',
  age: 35,
  address: 'Ottawa, Canada'
}

const client2 = {
  id: 2,
  name: 'Diana',
  gender: 'Female',
  age: 25,
  address: 'New York, USA'
}

@Component({
  selector: 'app-uncommon-page',
  imports: [CardComponent, I18nSelectPipe, I18nPluralPipe, SlicePipe, JsonPipe, KeyValuePipe, TitleCasePipe, AsyncPipe],
  templateUrl: './uncommon-page.component.html',
})
export class UncommonPageComponent {
  // i18nSelect
  client = signal(client1);
  clients = signal([client1, client2, client1, client2, client1, client2]);
  start = signal(0);
  end = signal(3);

  changeClient(): void {
    this.client.set(this.client() === client1 ? client2 : client1);
  }

  invitationMap = {
    'Male': 'Sr.',
    'Female': 'Sra.',
  }

  clientsMap = {
    '=0': 'no clients',
    '=1': 'one client',
    '=2': 'two clients',
    'other': '# clients'
  }

  // keyValue Pipe
  profile = {
    name: 'Bruce',
    age: 35,
    address: 'Ottawa, Canada',
    hobbies: ['Cooking', 'Sports', 'Reading']
  }

  // Async Pipe
  promiseValue: Promise<string> = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Async Pipe Value');
      console.log('Promise resolved');
    }, 2000);
  });

  MyObservableTimer = interval(2000).pipe(
    tap(value => console.log('Observable emitted', value))
  );

  removeClient(): void {
    const currentClients = this.clients();
    currentClients.pop();
    this.clients.set([...currentClients]);
  }

  addClient(): void {
    const newClient = this.clients().length % 2 === 0 ? client1 : client2;
    this.clients.set([...this.clients(), newClient]);
  }

  nextPage() {
    this.start.set(this.start() + 3);
    this.end.set(this.end() + 3);
  }

  prevPage() {
    this.start.set(Math.max(this.start() - 3, 0));
    this.end.set(Math.max(this.end() - 3, 3));
  }
}
