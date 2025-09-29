import { afterNextRender, Component, effect, OnChanges, OnInit, signal } from '@angular/core';
import { TitleComponent } from "../../components/navbar/title/title.component";

const log = (...messages: string[]) => {
  console.log(`${messages[0]} %c${messages[1]}`, 'color: green; font-weight: bold;');
}

@Component({
  selector: 'app-home-page',
  imports: [TitleComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnChanges{

  traditionalProperty = 'I am a traditional property';
  signalProperty = signal('I am a signal property');

  constructor() {
    log('HomePageComponent', 'Constructor called');

    // setTimeout(() => {
    //   this.traditionalProperty = 'Traditional property changed after 2 seconds';
    //   console.log('Traditional property changed after 2 seconds');
    //   // this.signalProperty.set('Signal property changed after 2 seconds');
    // }, 2000);
  }

  changeTraditionalProperty() {
    this.traditionalProperty = 'Traditional property changed';
  }

  changeSignalProperty() {
    this.signalProperty.set('Signal property changed');
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
