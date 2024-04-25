import { ChartOptions } from '../types/carbon-estimator';

export enum EmissionsColours {
  Upstream = '#40798C',
  Direct = '#CB3775',
  Indirect = '#91234C',
  Downstream = '#4B7E56',
}

export const tooltipFormatter = (value: number) => (value < 1 ? '<1%' : `${Math.round(value)}%`);

const customTooltip = ({
  series,
  seriesIndex,
  dataPointIndex,
  w,
}: {
  series: number[][];
  seriesIndex: number;
  dataPointIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  w: any;
}) => {
  const initialSeries = w.globals.initialSeries[seriesIndex];
  const data = initialSeries.data[dataPointIndex];

  return `<div class="rounded flex max-w-40 md:max-w-none">
  <div class="p-1 md:p-2 flex" style="background-color:${initialSeries.color}"><div class="${data.meta.svg} m-auto size-4 md:size-8"></div></div>
    <div class="p-1 md:p-2">
    <div class="text-wrap">${data.meta.parent}:</div>
    <div class="text-wrap">${data.x} -
    <span class="font-bold">${tooltipFormatter(series[seriesIndex][dataPointIndex])}</span></div></div>`;
};

export const chartOptions: ChartOptions = {
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '20px',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontWeight: '400',
    markers: {
      height: 20,
      width: 10,
      radius: 2,
      offsetY: 2,
    },
  },
  chart: {
    type: 'treemap',
    toolbar: {
      show: false,
    },
    selection: {
      enabled: false,
    },
  },
  plotOptions: {
    treemap: {
      distributed: false,
      enableShades: false,
      borderRadius: 4,
    },
  },
  tooltip: {
    custom: customTooltip,
  },
  states: {
    active: {
      filter: {
        type: 'none',
        value: 0,
      },
    },
  },
  dataLabels: {
    style: {
      fontSize: '16px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontWeight: '400',
    },
  },
};

export const estimatorHeights = {
  title: 60,
  padding: 32,
  button: 40,
  chartExtra: 15,
};

export enum SVG {
  WEB = 'web-logo',
  DEVICES = 'devices-logo',
  ROUTER = 'router-logo',
  STORAGE = 'storage-logo',
  CLOUD = 'cloud-logo',
  CELL_TOWER = 'cell-tower-logo',
}

export enum EmissionsLabels {
  Upstream = 'Upstream Emissions',
  Direct = 'Direct Emissions',
  Indirect = 'Indirect Emissions',
  Downstream = 'Downstream Emissions',
}
