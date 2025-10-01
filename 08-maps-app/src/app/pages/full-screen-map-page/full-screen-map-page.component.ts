
import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;
@Component({
  selector: 'app-full-screen-map-page',
  imports: [],
  templateUrl: './full-screen-map-page.component.html',
  styles: `
  div {
    width: 100vw;
    height: calc(100vh - 64px);
    background-color: lightgray;
  }
  `
})
export class FullScreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  ngAfterViewInit(): void {
    if (!this.divElement()) return;
    const element = this.divElement();
    const map = new mapboxgl.Map({
      container: element?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.0721, 4.7110], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
  }

}
