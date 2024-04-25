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
    <div class="p-1 md:p-2 flex" style="background-color:${initialSeries.color}"><svg class=" m-auto size-4 md:size-8" viewBox="0 -960 960 960"><path style="fill:white" d="${data.meta.svg}"/></svg></div>
    <div class="p-1 md:p-2">
    <div class="text-wrap">${initialSeries.name.split(' -')[0]}:</div>
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
  WEB = 'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h420v-140H160v140Zm500 0h140v-360H660v360ZM160-460h420v-140H160v140Z',
  DEVICES = 'M80-160v-120h80v-440q0-33 23.5-56.5T240-800h600v80H240v440h240v120H80Zm520 0q-17 0-28.5-11.5T560-200v-400q0-17 11.5-28.5T600-640h240q17 0 28.5 11.5T880-600v400q0 17-11.5 28.5T840-160H600Zm40-120h160v-280H640v280Zm0 0h160-160Z',
  ROUTER = 'M200-120q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h400v-160h80v160h80q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm80-40q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm140 0q17 0 28.5-11.5T460-280q0-17-11.5-28.5T420-320q-17 0-28.5 11.5T380-280q0 17 11.5 28.5T420-240Zm140 0q17 0 28.5-11.5T600-280q0-17-11.5-28.5T560-320q-17 0-28.5 11.5T520-280q0 17 11.5 28.5T560-240Zm10-390-58-58q26-24 58-38t70-14q38 0 70 14t58 38l-58 58q-14-14-31.5-22t-38.5-8q-21 0-38.5 8T570-630ZM470-730l-56-56q44-44 102-69t124-25q66 0 124 25t102 69l-56 56q-33-33-76.5-51.5T640-800q-50 0-93.5 18.5T470-730ZM200-200v-160 160Z',
  STORAGE = 'M120-160v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80-440v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80 280v-160h720v160H120Zm80-40h80v-80h-80v80Z',
  CLOUD = 'M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z',
  CELL_TOWER = 'M196-276q-57-60-86.5-133T80-560q0-78 29.5-151T196-844l48 48q-48 48-72 110.5T148-560q0 63 24 125.5T244-324l-48 48Zm96-96q-39-39-59.5-88T212-560q0-51 20.5-100t59.5-88l48 48q-30 27-45 64t-15 76q0 36 15 73t45 67l-48 48ZM280-80l135-405q-16-14-25.5-33t-9.5-42q0-42 29-71t71-29q42 0 71 29t29 71q0 23-9.5 42T545-485L680-80h-80l-26-80H387l-27 80h-80Zm133-160h134l-67-200-67 200Zm255-132-48-48q30-27 45-64t15-76q0-36-15-73t-45-67l48-48q39 39 58 88t22 100q0 51-20.5 100T668-372Zm96 96-48-48q48-48 72-110.5T812-560q0-63-24-125.5T716-796l48-48q57 60 86.5 133T880-560q0 78-28 151t-88 133Z',
}

export enum EmissionsLabels {
  Upstream = 'Upstream Emissions',
  Direct = 'Direct Emissions',
  Indirect = 'Indirect Emissions',
  Downstream = 'Downstream Emissions',
}
