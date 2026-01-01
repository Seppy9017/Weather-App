import getWeatherData from "./utils/HttpReq.js";
import {getWeekDay} from "./utils/customDate.js";
import { showModal, removeModal } from "./utils/modal.js";

const searchInput = document.querySelector("input");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const searchButton = document.querySelector("button");
const modalButton = document.getElementById("modal-button");

const renderCurrentWeather = async (data) => {
  
  if (!data) return;
  const weatherJSX = `
    <h1>${data.name} , ${data.sys.country}</h1>
    <div id ="main">
      <img alt="weather icon" src="https://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png"/>
      <span>${data.weather[0].main}</span>
      <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
      <p>Humidity : <span>${data.main.humidity}%</span></p>
      <p>Wind Speed : <span>${data.wind.speed}  m/s</span></p>
    </div>
  `;
  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) return;

  forecastContainer.innerHTML = "";

  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  console.log(data);
  data.forEach((i) => {
    const forecastJSX = `
    
      <div>
        <img alt="weather icon" src="https://openweathermap.org/img/w/${
          i.weather[0].icon
        }.png"/>      
        <h3>${getWeekDay(i.dt)}</h3>
        <p>${Math.round(i.main.temp)} °C</p>
        <span>${i.weather[0].main}</span>
      </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  weatherContainer.innerHTML = '<span id="loader"></span>';
  forecastContainer.innerHTML = "";

  const cityName = searchInput.value;
  if (!cityName) {
    showModal("Please enter city name!");
    return;
  }

  const currentData = await getWeatherData("current", cityName);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
  renderCurrentWeather(currentData);
};

const positionCalback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getWeatherData("current", position.coords);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderCurrentWeather(currentData);
  renderForecastWeather(forecastData);
};

const errorCalback = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  weatherContainer.innerHTML = '<span id="loader"></span>';
  forecastContainer.innerHTML = "";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCalback, errorCalback);
  } else {
    showModal("Your browser doesn't support geolocation!");
  }
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "hamedan");
  const forecastData = await getWeatherData("forecast", "hamedan");
  renderForecastWeather(forecastData);
  renderCurrentWeather(currentData);
};
searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
