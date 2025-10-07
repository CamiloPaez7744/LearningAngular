
import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;
@Component({
  selector: 'app-full-screen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './full-screen-map-page.component.html',
  styles: `
  div {
    width: 100vw;
    height: calc(100vh - 64px);
    background-color: lightgray;
  }

  #controls {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 999;
    width: 250px;
  }
  `
})
export class FullScreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(5);
  coordinates = signal({
    lng: -74.0721,
    lat: 4.7110
  });

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.zoom());
  });

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()) return;

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement();
    const { lng, lat } = this.coordinates();
    const map = new mapboxgl.Map({
      container: element?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom() // starting zoom
    });
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();
      this.coordinates.set({ lng, lat });
    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    this.map.set(map);
  }

}
