let userData = document.querySelector("[data-userWeather]");
let userSearch = document.querySelector("[data-searchWeather]")
let container = document.querySelector(".weather-container");
let grantAccess = document.querySelector(".grant-location-container");
let formSelector = document.querySelector("[data-searchForm]")
let load = document.querySelector(".loading-container");
let show = document.querySelector(".user-info-container");


let currentTab = userData;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
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
            getinfoweather();
        }
    }
}

userData.addEventListener("click", () => {
    switchTab(userData);
})

userSearch.addEventListener("click", () => {
    switchTab(userSearch);
})


function getinfoweather() {
    const cordinates = sessionStorage.getItem("user-cordinates");
    if (!cordinates) {
        grantAccess.classList.add("active");
    } else {
        const user_cordinates = JSON.parse(cordinates);
        fetchweatherinfo(user_cordinates);
    }
}

async function fetchweatherinfo(cordinate) {
    let {lat,lon} = cordinate;
    
    grantAccess.classList.remove("active");
    load.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data = response.json();
        load.classList.remove("active");
        userData.classList.add("active");
        renderinfo(data);

    } catch(err) {
        load.classList.remove("active");
    }
}