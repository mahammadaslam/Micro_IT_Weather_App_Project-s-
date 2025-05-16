const apiKey = 'f00c38e0279b7bc85480c3fe775d518c'; // Your OpenWeatherMap API key
const url = 'https://api.openweathermap.org/data/2.5/weather';

let isCelsius = true; // Track unit toggle

$(document).ready(function () {
  // Default city
  weatherFn('Pune');

  // Search button click
  $('#city-input-btn').on('click', () => {
    const city = $('#city-input').val().trim();
    if (city) {
      weatherFn(city);
    } else {
      alert('Please enter a city name.');
    }
  });

  // Enter key triggers search
  $('#city-input').on('keypress', function(e) {
    if (e.key === 'Enter') {
      $('#city-input-btn').click();
    }
  });

  // Unit toggle buttons
  $('#unitC').on('click', () => {
    if (!isCelsius) {
      isCelsius = true;
      $('#unitC').addClass('active');
      $('#unitF').removeClass('active');
      const city = $('#city-name').text().split(',')[0];
      if (city) weatherFn(city);
    }
  });

  $('#unitF').on('click', () => {
    if (isCelsius) {
      isCelsius = false;
      $('#unitF').addClass('active');
      $('#unitC').removeClass('active');
      const city = $('#city-name').text().split(',')[0];
      if (city) weatherFn(city);
    }
  });

  // Geolocation button
  $('#geoBtn').on('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        weatherByCoords(latitude, longitude);
      }, () => {
        alert('Could not get your location. Please allow location access or enter city manually.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });
});

// Fetch weather by city name
async function weatherFn(cityName) {
  const units = isCelsius ? 'metric' : 'imperial';
  const apiUrl = `${url}?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=${units}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (res.ok) {
      weatherShowFn(data);
      $('#errorMsg').text('');
    } else {
      $('#errorMsg').text('City not found. Please try again.');
      $('#weather-info').hide();
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    $('#errorMsg').text('Error fetching weather data. Please try again later.');
    $('#weather-info').hide();
  }
}

// Fetch weather by coordinates (for geolocation)
async function weatherByCoords(lat, lon) {
  const units = isCelsius ? 'metric' : 'imperial';
  const apiUrl = `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    if (res.ok) {
      weatherShowFn(data);
      $('#errorMsg').text('');
    } else {
      $('#errorMsg').text('Location not found. Please try again.');
      $('#weather-info').hide();
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    $('#errorMsg').text('Error fetching weather data. Please try again later.');
    $('#weather-info').hide();
  }
}

// Show weather data on page
function weatherShowFn(data) {
  $('#city-name').text(`${data.name}, ${data.sys.country}`);
  $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
  $('#temperature').html(`${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`);
  $('#description').text(data.weather[0].description);
  $('#wind-speed').html(`Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`);
  
  // Weather icon URL from OpenWeatherMap
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  $('#weather-icon').attr('src', iconUrl);

  $('#weather-info').fadeIn();
}








