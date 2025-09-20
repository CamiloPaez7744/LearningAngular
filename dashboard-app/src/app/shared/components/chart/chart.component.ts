import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfig } from '../../interfaces/chart.interface';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-chart',
  imports: [NgxEchartsDirective],
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  config = input.required<ChartConfig>();

  chartOptions = computed((): echarts.EChartsOption => {
    const cfg = this.config();
    const { type, data, style } = cfg;
    const color = style?.color ?? '#3b82f6';

    switch (type) {
      case 'line1':
      case 'line2':
      case 'line3':
      case 'line4':
      case 'line5':
        return {
          grid: { left: 0, right: 0, top: 5, bottom: 0, containLabel: false },
          xAxis: { type: 'category', data: data.labels, show: style?.showAxis, boundaryGap: false },
          yAxis: { type: 'value', show: style?.showAxis, min: 0, },
          series: [{
            data: data.values,
            type: 'line',
            smooth: style?.smooth,
            symbol: style?.showPoints ? 'circle' : 'none',
            lineStyle: { width: 2, color },
            areaStyle: style?.showArea ? { opacity: 0.2, color } : undefined,
            itemStyle: { color }
          }],
          tooltip: { trigger: 'axis' }
        };

      case 'bar-vertical':
        return {
          xAxis: { type: 'category', data: data.labels, show: style?.showAxis, boundaryGap: false },
          yAxis: { type: 'value', show: style?.showAxis, min: 0 },
          series: [{ data: data.values, type: 'bar', itemStyle: { color } }],
          title: style?.showTitle ? { text: style?.title } : undefined,
          tooltip: { trigger: 'axis' }
        };

      case 'bar-horizontal':
        return {
          xAxis: { type: 'value', show: style?.showAxis },
          yAxis: { type: 'category', data: data.labels, show: style?.showAxis },
          series: [{ data: data.values, type: 'bar', itemStyle: { color } }],
          title: style?.showTitle ? { text: style?.title } : undefined,
          tooltip: { trigger: 'axis' }
        };

      case 'pie':
      case 'doughnut':
        return {
          series: [{
            type: 'pie',
            radius: type === 'doughnut' ? ['40%', '70%'] : '70%',
            data: data.labels?.map((label, i) => ({
              name: label,
              value: data.values[i]
            })),
          }],
          tooltip: { trigger: 'item' },
          legend: style?.legend ? { top: 'bottom' } : undefined,
          title: style?.showTitle ? { text: style?.title } : undefined
        };

      case 'scatter':
        return {
          xAxis: {},
          yAxis: {},
          series: [{ type: 'scatter', data: data.values.map((v, i) => [i, v]) }],
          tooltip: { trigger: 'item' }
        };

      default:
        return {};
    }
  });
}
