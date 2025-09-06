import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './hero-page.component.html',
  imports: [UpperCasePipe]
})

export class HeroPageComponent {
  private hero = {
    name: signal('Iron Man'),
    age: signal(45)
  };

  heroDescription = computed(() => {
    return `${this.hero.name()} is ${this.hero.age()} years old.`;
  })

  capitalizeName = computed(() => {
    return this.hero.name().toUpperCase();
  })

  name() {
    return this.hero.name();
  }

  age() {
    return this.hero.age();
  }

  changeHero() {
    this.hero.name.set('Batman');
    this.hero.age.set(35);
  }

  changeAge() {
    this.hero.age.set(99);
  }

  resetForm() {
    this.hero = {
      name: signal('Superman'),
      age: signal(30)
    };
  }
}
