import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { generateNiceHexColor } from '../../utils/color.util';
import { v4 as uuidv4 } from 'uuid';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;
interface Marker {
  id: string;
  mapboxgl: mapboxgl.Marker;
}
@Component({
  selector: 'app-markers-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

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

    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);
    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    const { lng, lat } = event.lngLat;
    this.makeMarker(lng, lat);
  }

  makeMarker(lng: number, lat: number) {
    if (!this.map()) return;
    const marker = new mapboxgl.Marker({ color: generateNiceHexColor() })
      .setLngLat([lng, lat])
      .addTo(this.map()!);
    const newMarker: Marker = { id: uuidv4(), mapboxgl: marker };
    this.markers.update(markers => [newMarker, ...markers]);
    console.log(this.markers());
  }

  flyToMarker(marker: Marker) {
    if (!this.map()) return;
    const { lng, lat } = marker.mapboxgl.getLngLat();
    this.map()?.flyTo({
      center: [lng, lat],
      zoom: 8
    });
  }

  removeMarker(marker: Marker) {
    if (!this.map()) return;
    marker.mapboxgl.remove();
    this.markers.update(markers => markers.filter(m => m.id !== marker.id));
  }
}
