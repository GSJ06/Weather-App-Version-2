// Constants
const KELVIN = 273;
const API_KEY = ""; // Add your actual API key

// DOM Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const tempMinElement = document.querySelector("#temp-min");
const tempMaxElement = document.querySelector("#temp-max");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");

// Weather data
const weather = {
  temperature: {
    value: undefined,
    unit: "C", // Default unit
  },
  description: "",
  iconId: "",
  city: "",
  country: "",
  temp_max: {
    value: undefined,
    unit: "C", // Default unit
  },
  temp_min:{
    value: undefined,
    unit: "C", // Default unit
  },
  pressure:"",
  humidity:"",
};

// Event listeners
searchButton.addEventListener("click", () => {
  notificationElement.style.display = "none";
  notificationElement.innerHTML = '';
  const location = locationInput.value.trim();
  if (!location) {
    alert("Please enter a location.");
    return;
  }
  getWeather(location);
});

tempElement.addEventListener("click", () => {
  toggleTemperatureUnit();
});

// Geolocation support check
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  displayError("Browser doesn't support geolocation.");
}

// Functions (refactored)
function setPosition(position) {
  const { latitude, longitude } = position.coords;
  getWeatherByCoordinates(latitude, longitude);
}

function showError(error) {
  displayError(error.message);
}

function displayError(message) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${message}</p>`;
}

function getWeather(location) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
  fetchWeatherData(api);
}

function getWeatherByCoordinates(latitude, longitude) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  fetchWeatherData(api);
}

function fetchWeatherData(api) {
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.temp_min.value = Math.floor(data.main.temp_min - KELVIN);
      weather.temp_max.value = Math.floor(data.main.temp_max - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.humidity = data.humidity;
      weather.pressure = data.pressure;
      weather.country = data.sys.country;
    })
    .then(() => {
      displayWeather();
    })
    .catch((error) => {
      displayError("An error occurred while fetching weather data.");
      console.error(error);
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  tempMinElement.innerHTML = `Min: ${weather.temp_min.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  tempMaxElement.innerHTML = `Max: ${weather.temp_max.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function toggleTemperatureUnit() {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
}

function celsiusToFahrenheit(temperature) {
  return (temperature * 9/5) + 32;
}