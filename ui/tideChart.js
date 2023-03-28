import { calculateSunEvents, formatDate } from './utils.js';

const createTideChart = (data) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Tide Height',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        tension: 0.4 // set tension to 0.4 for a more smooth line
      }
    ]
  };

  const now = new Date();
  const nowIndex = data.tides.findIndex(tide => new Date(tide.date) > now) - 1;

  data.tides.forEach((tide, index) => {
    const date = new Date(tide.date);
    const formattedDate = formatDate(date);
    chartData.labels.push(formattedDate);
    chartData.datasets[0].data.push(tide.height);
  });

  const sunEvents = calculateSunEvents(data);

  const annotations = sunEvents.flatMap((event, index) => {
    const sunriseIndex = chartData.labels.findIndex(label => label === formatDate(event.sunrise));
    const sunsetIndex = chartData.labels.findIndex(label => label === formatDate(event.sunset));

    return [
      {
        type: 'rect',
        x: sunriseIndex - 0.5,
        y: 0,
        width: sunsetIndex - sunriseIndex + 1,
        height: 10, // Set this to an appropriate maximum tide height value
        backgroundColor: 'rgba(200, 200, 255, 0.2)',
        borderColor: 'rgba(0, 0, 0, 0)'
      }
    ];
  });

  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDraw: (chart) => {
      if (chart.config.options.plugins.verticalLinePlugin.nowIndex === undefined) return;
      const ctx = chart.ctx;
      const xAxis = chart.scales['x'];
      const yAxis = chart.scales['y'];
      const nowIndex = chart.config.options.plugins.verticalLinePlugin.nowIndex;
      const x = xAxis.getPixelForValue(chart.data.labels[nowIndex]);
      const y1 = yAxis.bottom;
      const y2 = yAxis.top;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF0000';
      ctx.stroke();
      ctx.restore();
    }
  };

  new Chart(document.getElementById('tideChart').getContext('2d'), {
  type: 'line',
  data: chartData,
  options: {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: 'Tide Height (ft)',
        },
      },
    },
    plugins: {
      verticalLinePlugin: {
        nowIndex: nowIndex,
      },
      annotation: {
        annotations: annotations,
      },
    },
  },
  plugins: [verticalLinePlugin],
});
};

export default createTideChart;

