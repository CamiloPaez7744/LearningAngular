import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero-page.component.html',
})

export class HeroPageComponent {
  private hero = {
    name: signal('Iron Man'),
    age: signal(45)
  };

  name() {
    return this.hero.name();
  }

  age() {
    return this.hero.age();
  }

  getHeroDescription() {
    return `${this.name()} is ${this.age()} years old.`;
  }

  changeHero() {
    this.hero.name.set('Batman');
    this.hero.age.set(35);
  }

  changeAge() {
    this.hero.age.set(35);
  }

  capitalizeName() {
    return this.name().toUpperCase();
  }

  resetForm() {
    this.hero = {
      name: signal('Superman'),
      age: signal(30)
    };
  }
}
