import { formatDate } from './utils.js';

const createTideChart = (data) => {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: 'Tide Height',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const now = new Date();
  const nowIndex = data.tides.findIndex(tide => new Date(tide.date) > now) - 1;

  data.tides.forEach((tide, index) => {
    const date = new Date(tide.date);
    const formattedDate = formatDate(date);
    chartData.labels.push(formattedDate);
    chartData.datasets[0].data.push(tide.height);
  });

  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDraw: (chart) => {
      const { ctx, scales, config } = chart;
      const nowIndex = config.options.plugins.verticalLinePlugin.nowIndex;

      if (nowIndex !== undefined) {
        const yAxis = scales.y;
        const xScale = scales.x;
        const xPos1 = xScale.getPixelForValue(chartData.labels[nowIndex], nowIndex);
        const xPos2 = xScale.getPixelForValue(chartData.labels[nowIndex + 1], nowIndex + 1);
        const prevTide = new Date(data.tides[nowIndex].date);
        const nextTide = new Date(data.tides[nowIndex + 1].date);
        const now = new Date();

        const ratio = (now - prevTide) / (nextTide - prevTide);
        const xPos = xPos1 + (xPos2 - xPos1) * ratio;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xPos, yAxis.top);
        ctx.lineTo(xPos, yAxis.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
        ctx.restore();
      }
    },
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
      },
    },
    plugins: [verticalLinePlugin],
  });
};

export default createTideChart;

