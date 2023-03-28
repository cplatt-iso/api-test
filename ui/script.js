import createTideChart from './tideChart.js';
import formatDate from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const tideDataElement = document.getElementById('tideData');

  fetch('http://192.168.88.145:5000/api?unit=ft')
    .then(response => response.json())
    .then(data => {
       let html = '<table><thead><tr><th>Type</th><th>Date & Time</th><th>Height (ft)</th></tr></thead><tbody>';
       data.tides.forEach(tide => {
       html += `<tr><td>${tide.type}</td><td>${formatDate(new Date(tide.date))}</td><td>${tide.height.toFixed(2)}</td></tr>`;
     });
     html += '</tbody></table>';
     tideDataElement.innerHTML = html;
     createTideChart(data);
  })

    .catch(error => {
      console.error('Error fetching tide data:', error);
      tideDataElement.innerHTML = 'Failed to fetch tide data.';
    });
});

