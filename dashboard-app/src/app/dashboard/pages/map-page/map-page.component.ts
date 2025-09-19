import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MapPoint } from '../../interfaces/map-colombia.interface';
import { MapColombiaComponent } from "../../components/map-colombia/map-colombia.component";

@Component({
  selector: 'app-map-page',
  imports: [MapColombiaComponent],
  templateUrl: './map-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent {
  points: MapPoint[] = [
    { id: '1', name: 'Bogotá', region: 'Cundinamarca', lat: 4.711, lng: -74.072, value: 200 },
    { id: '2', name: 'Medellín', region: 'Antioquia', lat: 6.244, lng: -75.581, value: 150 },
    { id: '3', name: 'Cali', region: 'Valle del Cauca', lat: 3.437, lng: -76.522, value: 100 },
  ];
 }
