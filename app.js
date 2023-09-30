// Constants
const KELVIN = 273; // Kelvin temperature offset
const API_KEY = ""; // Add your actual API key

// DOM Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const tempMinElement = document.querySelector("#temp-min");
const tempMaxElement = document.querySelector("#temp-max");
const humidityElement = document.querySelector("#humidity");
const windspeedElement = document.querySelector("#windspeed");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");

// Weather data
const weather = {
  temperature: {
    value: undefined,
    unit: "C", // Default temperature unit
  },
  description: "",
  iconId: "",
  city: "",
  country: "",
  temp_max: {
    value: undefined,
    unit: "C", // Default temperature unit
  },
  temp_min: {
    value: undefined,
    unit: "C", // Default temperature unit
  },
  pressure: "",
  humidity: "",
  wind: "",
};

// Event listeners
searchButton.addEventListener("click", () => {
  notificationElement.style.display = "none"; // Hide any previous error messages
  notificationElement.innerHTML = ""; // Clear the error message text
  const location = locationInput.value.trim();
  if (!location) {
    alert("Please enter a location.");
    return;
  }
  getWeather(location);
});

tempElement.addEventListener("click", () => {
  toggleTemperatureUnit(); // Toggle temperature unit when clicked
});

// Check if geolocation is supported by the browser
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  displayError("Browser doesn't support geolocation.");
}

// Functions

// Set the user's location based on geolocation data
function setPosition(position) {
  const { latitude, longitude } = position.coords;
  getWeatherByCoordinates(latitude, longitude);
}

// Handle geolocation error
function showError(error) {
  displayError(error.message);
}

// Display an error message on the frontend
function displayError(message) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${message}</p>`;
  clearWeatherData(); // Clear weather data on error
}

// Fetch weather data by city name
function getWeather(location) {
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;
  fetchWeatherData(api);
}

// Fetch weather data by coordinates
function getWeatherByCoordinates(latitude, longitude) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  fetchWeatherData(api);
}

// Fetch weather data from the API
function fetchWeatherData(api) {
  fetch(api)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found"); // Handle API error
      }
      return response.json();
    })
    .then((data) => {
      // Parse API data and store it in the 'weather' object
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.temp_min.value = Math.floor(data.main.temp_min - KELVIN);
      weather.temp_max.value = Math.floor(data.main.temp_max - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.humidity = data.main.humidity;
      weather.pressure = data.main.pressure;
      weather.wind = data.wind.speed;
      weather.country = data.sys.country;
    })
    .then(() => {
      displayWeather(); // Display weather data on success
    })
    .catch((error) => {
      if (error.message === "City not found") {
        displayError("City not found. Please enter a valid city name.");
      } else {
        displayError("An error occurred while fetching weather data.");
        console.error(error);
      }
      clearWeatherData(); // Clear weather data on error
    });
}

// Display weather data on the frontend
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  tempMinElement.innerHTML = `L: ${weather.temp_min.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  tempMaxElement.innerHTML = `H: ${weather.temp_max.value}°<span>${weather.temperature.unit.toUpperCase()}</span>`;
  humidityElement.innerHTML = `<img src="icons/humidity.png"/>  <span id="humidityText">${weather.humidity} % </span><br><span>Humidity</span>`;
  windspeedElement.innerHTML = `<img src="icons/wind.png"/>  <span id="windText">${weather.wind} </span><span id="unit">km/h </span><br><span>Wind</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// Toggle temperature unit between Celsius and Fahrenheit
function toggleTemperatureUnit() {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "C") {
    const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "F";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "C";
  }
}

// Convert temperature from Celsius to Fahrenheit
function celsiusToFahrenheit(temperature) {
  return (temperature * 9/5) + 32;
}

// Clear weather data on error
function clearWeatherData() {
  iconElement.innerHTML = "";
  tempElement.innerHTML = "";
  tempMinElement.innerHTML = "";
  tempMaxElement.innerHTML = "";
  humidityElement.innerHTML = "";
  windspeedElement.innerHTML = "";
  descElement.innerHTML = "";
  locationElement.innerHTML = "";
}