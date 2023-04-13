let submitEl = document.getElementById('submit');
let searchInputEl = document.getElementById('search-input');
let searchHistoryEl = document.getElementById('search-history');
let clearHistoryEl = document.getElementById('clear-history');
let todaysWeatherEl = document.querySelector('.todaysWeather');

let searchHistory = [];
let lat;
let lon;

const renderToday = (data) => {

}

const renderWeather = (data) => {
    renderToday(data);
    renderForecast(data);
}

const getWeather = (location) => {
    let { lat } = location;
    let { lon } = location;
    let city = location.name;
    
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6bb1b7f8b26934ef2b1028b12a559a0f`
    
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            renderWeather(data);
        })
    
}

const getCoords = (input) => {
    let coordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=6bb1b7f8b26934ef2b1028b12a559a0f`

    fetch(coordsUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getWeather(data[0]);
        })

}

const storeSearch = (input) => {
    searchHistory.push(input);

    localStorage.setItem('search-history', searchHistory);
}

const getHistory = () => {
    searchHistoryEl.textContent = '';

    let storedHistory = localStorage.getItem('search-history')
    // console.log('storedHistory: ' + storedHistory);

    if (storedHistory) {
        searchHistory = storedHistory.split(',')
    }
    // console.log('searchHistory: ' + searchHistory)
    for (let i = 0; i < searchHistory.length; i++) {
        let citiesEl = document.createElement('button');
        citiesEl.classList.add('btn')
        citiesEl.textContent = searchHistory[i]
        searchHistoryEl.append(citiesEl);
    }
}

const formSubmitHandler = (e) => {
    e.preventDefault();
    let input = searchInputEl.value.trim();
    // console.log('clicked: ' + input);

    storeSearch(input);
    getHistory();
    getCoords(input);
    searchInputEl.value = '';
}

const clearHistoryHandler = () => {
    localStorage.removeItem('search-history');
    searchHistory = [];
    searchHistoryEl.textContent = '';
}

getHistory();



submitEl.addEventListener('click', formSubmitHandler);
clearHistoryEl.addEventListener('click', clearHistoryHandler)