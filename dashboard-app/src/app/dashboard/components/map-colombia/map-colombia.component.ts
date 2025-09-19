import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import * as echarts from 'echarts';
import { MapPoint } from '../../interfaces/map-colombia.interface';
import { NgxEchartsDirective } from 'ngx-echarts';
import { MapService } from '../../services/map.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-map-colombia',
  imports: [NgxEchartsDirective],
  templateUrl: './map-colombia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapColombiaComponent {
  private mapService = inject(MapService);

  // Input reactivo
  data = input<MapPoint[]>([]);

  // Recurso para cargar el GeoJSON
  geoJsonResource = rxResource({
    stream: () => this.mapService.getColombiaMap()
  });

  // Opciones de ECharts
  chartOptions = computed((): echarts.EChartsOption => {
    const geoJson = this.geoJsonResource.value();
    if (!geoJson) return {};

    // Registrar el mapa solo cuando lo cargue
    echarts.registerMap('colombia', geoJson as any);

    return {
      geo: {
        map: 'colombia',
        roam: true,
        zoom: 1.5,
        center: [-74.297333, 4.570868],
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
