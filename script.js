const userData = document.querySelector("[data-userWeather]");
const userSearch = document.querySelector("[data-searchWeather]");
const container = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const formSelector = document.querySelector("[data-searchForm]");
const load = document.querySelector(".loading-container");
const show = document.querySelector(".user-info-container");

let currentTab = userData;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!formSelector.classList.contains("active")) {
            grantAccess.classList.remove("active");
            show.classList.remove("active");
            formSelector.classList.add("active");
        } else {
            formSelector.classList.remove("active");
            show.classList.remove("active");
            getWeatherInfo();
        }
    }
}

userData.addEventListener("click", () => {
    switchTab(userData);
});

userSearch.addEventListener("click", () => {
    switchTab(userSearch);
});

async function getWeatherInfo() {
    const coordinates = sessionStorage.getItem("user-coordinates");
    if (!coordinates) {
        grantAccess.classList.add("active");
    } else {
        const userCoordinates = JSON.parse(coordinates);
        await fetchWeatherInfo(userCoordinates);
    }
}

async function fetchWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantAccess.classList.remove("active");
    load.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        load.classList.remove("active");
        userData.classList.add("active");
        renderInfo(data);
    } catch (err) {
        console.error('Error fetching location weather info', err);
        load.classList.remove("active");
    }
}

function renderInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const btnAccess = document.querySelector("[data-grantAccess]");

btnAccess.addEventListener("click", getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");

formSelector.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();

    if (cityName) {
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    load.classList.add("active");
    userData.classList.remove("active");
    grantAccess.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        load.classList.remove("active");
        userData.classList.add("active");
        renderInfo(data);
    } catch (err) {
        console.error("Error fetching weather information:", err);
        alert("Error fetching weather information. Please try again.");
    }
}
