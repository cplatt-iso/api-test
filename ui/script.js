document.addEventListener('DOMContentLoaded', () => {
  const tideDataElement = document.getElementById('tideData');

  fetch('http://192.168.88.145:5000/api?unit=ft')
    .then(response => response.json())
    .then(data => {
      let html = '<ul>';
      data.tides.forEach(tide => {
        html += `<li>${tide.type} Tide: ${tide.date} - Height: ${tide.height.toFixed(2)} feet</li>`;
      });
      html += '</ul>';
      tideDataElement.innerHTML = html;
      createTideChart(data.tides);
    })
    .catch(error => {
      console.error('Error fetching tide data:', error);
      tideDataElement.innerHTML = 'Failed to fetch tide data.';
    });

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

    data.forEach(tide => {
      const date = new Date(tide.date);
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      chartData.labels.push(`${day} ${month} ${date.getDate()}`);
      chartData.datasets[0].data.push(tide.height);
    });

    const tideChart = new Chart(document.getElementById('tideChart').getContext('2d'), {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Day of Week'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Tide Height (ft)'
            }
          }]
        }
      }
    });
  };
});

