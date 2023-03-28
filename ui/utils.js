import SunCalc from 'suncalc';

function formatDate(date) {
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const dayOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = ((hours + 11) % 12 + 1).toString().padStart(2, '0');

  return `${day}, ${month}-${dayOfMonth} ${formattedHours}:${minutes} ${ampm}`;
}

function calculateSunEvents(data) {
  // Replace these with the actual latitude and longitude of the location
  const lat = 41.2617;
  const lng = -72.8182;

  const sunEvents = [];

  data.tides.forEach((tide, index) => {
    const date = new Date(tide.date);
    const sunTimes = SunCalc.getTimes(date, lat, lng);

    sunEvents.push({
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
    });
  });

  return sunEvents;
}

export { formatDate, calculateSunEvents };

