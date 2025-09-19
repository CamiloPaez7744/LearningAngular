import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import * as echarts from 'echarts';
import { MapPoint } from '../../interfaces/map-colombia.interface';
import { NgxEchartsDirective } from 'ngx-echarts';
import { MapService } from '../../services/map.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-map-colombia',
  imports: [NgxEchartsDirective, JsonPipe],
  templateUrl: './map-colombia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapColombiaComponent {
  private mapService = inject(MapService);

  // Datos de entrada
  data = input<MapPoint[]>([]);

  // Recurso reactivo para cargar el mapa
  geoJsonResource = rxResource({
    stream: () => this.mapService.getColombiaMap()
  });

  // Computed que depende del recurso y de data()
  chartOptions = computed((): echarts.EChartsOption => {
    const geoJson = this.geoJsonResource.value();
    if (!geoJson) return {};

    // registrar el mapa dinámicamente cuando esté listo
    echarts.registerMap('colombia', geoJson as any);

    return {
      geo: {
        map: 'colombia',
        roam: true,
        label: { show: true, fontSize: 9 },
        itemStyle: { borderColor: '#999', areaColor: '#e0f2fe' },
        emphasis: { itemStyle: { areaColor: '#93c5fd' } }
      },
      series: [
        {
          name: 'Puntos',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: (val: any) => Math.max(val[2] / 50, 10),
          itemStyle: { color: '#ef4444' },
          data: this.data().map(d => ({
            name: d.name,
            value: [d.lng, d.lat, d.value]
          }))
        }
      ],
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesType === 'scatter') {
            return `<b>${params.name}</b><br/>Valor: ${params.value[2]}`;
          }
          return params.name;
        }
      }
    };
  });
}
