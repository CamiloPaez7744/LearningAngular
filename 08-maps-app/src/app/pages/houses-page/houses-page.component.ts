import { Component, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { MiniMapComponent } from "../../maps/components/mini-map/mini-map.component";
interface HouseProperty {
  id: string;
  name: string;
  description: string;
  price: number;
  lngLat: { lng: number; lat: number };
  tags: string[];
}

@Component({
  selector: 'app-houses-page',
  imports: [MiniMapComponent],
  templateUrl: './houses-page.component.html',
})
export class HousesPageComponent {
  houses = signal<HouseProperty[]>([
    {
      id: uuid(),
      name: 'Casa Cartagena',
      description:
        'Hermosa casa colonial ubicada en el centro histórico de Cartagena, cerca de las murallas y el mar.',
      price: 800_000,
      lngLat: { lng: -75.547601, lat: 10.423634 },
      tags: ['Colonial', 'Cartagena', 'Centro Histórico'],
    },
    {
      id: uuid(),
      name: 'Apartamento Medellín',
      description:
        'Moderno apartamento en El Poblado, con vista a las montañas y acceso a zonas comerciales.',
      price: 600_000,
      lngLat: { lng: -75.567001, lat: 6.209517 },
      tags: ['Apartamento', 'Medellín', 'El Poblado'],
    },
    {
      id: uuid(),
      name: 'Finca Cafetera Manizales',
      description:
        'Finca tradicional en las afueras de Manizales, rodeada de cafetales y naturaleza.',
      price: 400_000,
      lngLat: { lng: -75.513817, lat: 5.070275 },
      tags: ['Finca', 'Café', 'Manizales'],
    },
    {
      id: uuid(),
      name: 'Casa en Santa Marta',
      description:
        'Casa frente al mar en Santa Marta, perfecta para disfrutar de la playa y la brisa caribeña.',
      price: 950_000,
      lngLat: { lng: -74.211022, lat: 11.240354 },
      tags: ['Playa', 'Santa Marta', 'Caribe'],
    },
  ]);
}
