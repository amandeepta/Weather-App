// Select necessary elements from the DOM
const userData = document.querySelector("[data-userWeather]");
const userSearch = document.querySelector("[data-searchWeather]");
const container = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const formSelector = document.querySelector("[data-searchForm]");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userData;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// Set initial tab
currentTab.classList.add("current-tab");

// Initialize weather information
initializeWeatherInfo();

// Function to initialize weather information
function initializeWeatherInfo() {
    const coordinates = sessionStorage.getItem("user-coordinates");
    if (!coordinates) {
        // If no coordinates found, ask for location access
        grantAccess.classList.add("active");
    } else {
        // If coordinates found, fetch weather information
        const userCoordinates = JSON.parse(coordinates);
        fetchWeatherInfo(userCoordinates);
    }
}

// Switch tab function
function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        // Check if form selector is active
        if (!formSelector.classList.contains("active")) {
            grantAccess.classList.remove("active");
            userInfoContainer.classList.remove("active");
            formSelector.classList.add("active");
        } else {
            formSelector.classList.remove("active");
            userInfoContainer.classList.remove("active");
            initializeWeatherInfo();
        }
    }
}

// Add event listeners for user data and user search tabs
userData.addEventListener("click", () => {
    switchTab(userData);
});

userSearch.addEventListener("click", () => {
    switchTab(userSearch);
});

// Function to fetch weather information based on coordinates
async function fetchWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;

    grantAccess.classList.remove("active");
    loadingContainer.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userData.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        console.error('Error fetching location weather info:', err);
        loadingContainer.classList.remove("active");
    }
}

// Function to render weather information on the page
function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name || 'N/A';
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description || 'N/A';
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// Add event listener for granting access to location
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// Function to get user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Handle location error
function handleLocationError(error) {
    console.error("Geolocation error:", error);
}

// Function to handle the user's position and store coordinates
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");
// Add event listener for form submission
formSelector.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value.trim();

    if (cityName) {
        fetchSearchWeatherInfo(cityName);
    }
});

// Function to fetch weather information based on city name
async function fetchSearchWeatherInfo(cityName) {
    loadingContainer.classList.add("active");
    userData.classList.remove("active");
    grantAccess.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingContainer.classList.remove("active");
        userData.classList.add("active");
        renderWeatherInfo(data);
    } catch (err) {
        console.error("Error fetching weather information:", err);
        alert("Error fetching weather information. Please try again.");
    }
}
