import { ChartOptions } from '../types/carbon-estimator';

export enum EmissionsColours {
  Upstream = '#40798C',
  UpstreamLight = '#bfdae2',
  Direct = '#CB3775',
  Indirect = '#91234C',
  OperationLight = '#f2afd1',
  AIInference = '#9B59B6',
  AIInferenceLight = '#e4c7f2',
  Downstream = '#4B7E56',
  DownstreamLight = '#c1d9c3',
  Total = '#646464',
}

export enum PlaceholderEmissionsColours {
  Upstream = '#333',
  Direct = '#666',
  Indirect = '#888',
  AIInference = '#999',
  Downstream = '#AAA',
}

export const percentageTooltipFormatter = (value: number) => (value < 1 ? '<1%' : `${Math.round(value)}%`);

export const tooltipFormatter = (value: number) => (value < 1 ? '<1 kg' : `${Math.round(value)} kg`);

const getCustomTooltip = (isPlaceholder: boolean, isMass: boolean) => {
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

    return `<div class="tce:rounded-sm tce:flex tce:max-w-40 tce:md:max-w-none tce:text-slate-600">
      <div class="tce:p-1 tce:md:p-2 tce:flex" style="background-color:${initialSeries.color}"><div class="${data.meta.svg} tce:m-auto tce:size-4 tce:md:size-8"></div></div>
        <div class="tce:p-1 tce:md:p-2">
        <div class="tce:text-wrap">${data.meta.parent}:</div>
        ${
          isPlaceholder ?
            '<div class="tce:text-wrap">Subcategories - <span class="tce:font-bold">?</span></div>'
          : `<div class="tce:text-wrap">${data.x} - <span class="tce:font-bold">${isMass ? tooltipFormatter(series[seriesIndex][dataPointIndex]) : percentageTooltipFormatter(series[seriesIndex][dataPointIndex])}</span></div>`
        }
        </div>`;
  };

  return customTooltip;
};

const getCustomDataLabel = (isPlaceholder: boolean, isMass: boolean) => {
  const customDataLabel = (
    value: string | number | number[],
    {
      seriesIndex,
      dataPointIndex,
      w,
    }: {
      seriesIndex: number;
      dataPointIndex: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      w: any;
    }
  ) => {
    const initialSeries = w.globals.initialSeries[seriesIndex];
    const data = initialSeries.data[dataPointIndex];

    if (isPlaceholder) return `${value} - ?`;

    return `${value} - ${isMass ? tooltipFormatter(data.y) : percentageTooltipFormatter(data.y)}`;
  };
  return customDataLabel;
};

export const getBaseChartOptions = (isPlaceholder: boolean, isMass: boolean) => {
  const chartOptions: ChartOptions = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '20px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontWeight: '400',
      markers: {
        strokeWidth: 2,
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
      animations: {
        speed: 450,
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
      custom: getCustomTooltip(isPlaceholder, isMass),
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    dataLabels: {
      formatter: getCustomDataLabel(isPlaceholder, isMass),
      style: {
        fontSize: '16px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontWeight: '400',
      },
    },
  };

  return chartOptions;
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
  AI = 'ai-logo',
}

export enum EmissionsLabels {
  Upstream = 'Upstream Emissions Estimate',
  Direct = 'Direct Emissions Estimate',
  Indirect = 'Indirect Emissions Estimate',
  AIInference = 'AI Inference Emissions Estimate',
  Downstream = 'Downstream Emissions Estimate',
}

export type ApexChartDataItem = { x: string; y: number; meta: { svg: string; parent: string } };

export type ApexChartSeriesItem = {
  name: string;
  color: string;
  data: ApexChartDataItem[];
};

export const placeholderData: ApexChartSeriesItem[] = [
  {
    name: `${EmissionsLabels.Upstream} - ?`,
    color: PlaceholderEmissionsColours.Upstream,
    data: [
      { x: EmissionsLabels.Upstream, y: 1, meta: { svg: 'question-mark-logo', parent: EmissionsLabels.Upstream } },
    ],
  },
  {
    name: `${EmissionsLabels.Direct} - ?`,
    color: PlaceholderEmissionsColours.Direct,
    data: [{ x: EmissionsLabels.Direct, y: 1, meta: { svg: 'question-mark-logo', parent: EmissionsLabels.Direct } }],
  },
  {
    name: `${EmissionsLabels.Indirect} - ?`,
    color: PlaceholderEmissionsColours.Indirect,
    data: [
      { x: EmissionsLabels.Indirect, y: 1, meta: { svg: 'question-mark-logo', parent: EmissionsLabels.Indirect } },
    ],
  },
  {
    name: `${EmissionsLabels.AIInference} - ?`,
    color: PlaceholderEmissionsColours.AIInference,
    data: [
      { x: EmissionsLabels.AIInference, y: 1, meta: { svg: 'question-mark-logo', parent: EmissionsLabels.AIInference } },
    ],
  },
  {
    name: `${EmissionsLabels.Downstream} - ?`,
    color: PlaceholderEmissionsColours.Downstream,
    data: [
      { x: EmissionsLabels.Downstream, y: 1, meta: { svg: 'question-mark-logo', parent: EmissionsLabels.Downstream } },
    ],
  },
];
