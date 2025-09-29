import { afterNextRender, Component, effect, OnChanges, OnInit } from '@angular/core';

const log = (...messages: string[]) => {
  console.log(`${messages[0]} %c${messages[1]}`, 'color: green; font-weight: bold;');
}

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnChanges{
  constructor() {
    log('HomePageComponent', 'Constructor called');
  }

  basicEffect = effect((onCleanup) => {
    log('Effect executed', 'This runs whenever any reactive state used inside changes.');

    onCleanup(() => {
      log('Effect cleaned up', 'This runs when the effect is destroyed.');
    });
  });

  ngOnInit() {
    log('ngOnInit called', 'Runs once after Angular has initialized all the component\'s inputs.');
  }

  ngOnChanges() {
    log('ngOnChanges called', 'Runs every time the component\'s inputs have changed.');
  }

  ngDoCheck() {
    log('ngDoCheck called', 'Runs every time this component is checked for changes.');
  }

  ngAfterContentInit() {
    log('ngAfterContentInit called', 'Runs once after the component\'s content has been initialized.');
  }

  ngAfterContentChecked() {
    log('ngAfterContentChecked called', 'Runs every time this component content has been checked for changes.');
  }

  ngAfterViewInit() {
    log('ngAfterViewInit called', 'Runs once after the component\'s view has been initialized.');
  }

  ngAfterViewChecked() {
    log('ngAfterViewChecked called', 'Runs every time the component\'s view has been checked for changes.');
  }

  ngOnDestroy() {
    log('ngOnDestroy called', 'Runs just before Angular destroys the component.');
  }

  afterNextRender = afterNextRender(() => {
    log('afterNextRender called', 'Runs after the next render cycle.');
  });

  ngAfterRender() {
    log('ngAfterRender called', 'Runs after the next render cycle.');
  }
}
