let submitEl = document.getElementById('submit');
let searchInputEl = document.getElementById('search-input');
let searchHistoryEl = document.getElementById('search-history');
let clearHistoryEl = document.getElementById('clear-history');
let todaysWeatherEl = document.querySelector('.todaysWeather');
let forecastsWeatherEl = document.querySelector('.forecastWeather');

let searchHistory = [];
let lat;
let lon;

const renderForecastCard = (data) => {
    forecastsWeatherEl.innerHTML = '';
    console.log('RENDERFORECASTCARDDATA');
    console.log(data)

    data.map((forecast, index) => {
        let card = document.createElement('div');
        let cardTitle = document.createElement('div');
        let iconId = forecast.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
        let iconImg = document.createElement('img');
        let temp = document.createElement('div');
        let wind = document.createElement('div');
        let humidity = document.createElement('div');

        cardTitle.textContent = dayjs.unix(forecast.dt).format('MMM D, YYYY');
        iconImg.setAttribute('src', iconUrl);
        temp.textContent = "Temp: " + forecast.main.temp
        wind.textContent = "Wind: " + forecast.wind.speed
        humidity.textContent = "Humidity: " + forecast.main.humidity

        card.classList.add('card')

        card.appendChild(cardTitle);
        card.appendChild(iconImg)
        card.appendChild(temp);
        card.appendChild(wind);
        card.appendChild(humidity);
        forecastsWeatherEl.appendChild(card)
    })
}

const renderForecast = (data) => {
    let forecastArr = data.list;

    let dayArr = [];

    for (let i = 0; i < forecastArr.length; i++) {
        let timestamp = forecastArr[i].dt
        let hour = dayjs.unix(timestamp).format('HH');

        let convertedDay = dayjs.unix(timestamp).format('D');

        let today = dayjs().format('D')

        if (today !== convertedDay && dayArr.length === 0) {
            dayArr.push(forecastArr[i])
        } else if (hour === '01') {
            dayArr.push(forecastArr[i])
        }
    }
    renderForecastCard(dayArr);
}


const renderToday = (data) => {
    // console.log(data);
    let currentDate = dayjs().format('MMM D, YYYY')
    let cityName = document.createElement('div');
    let temp = document.createElement('div');
    let humidity = document.createElement('div');
    let windSpeed = document.createElement('div');
    let iconId = data.weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
    let iconImg = document.createElement('img');

    iconImg.setAttribute('src', iconUrl)

    cityName.textContent = data.name
    temp.textContent = 'Temp: ' + data.main.temp
    humidity.textContent = 'Humidity: ' + data.main.humidity
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed

    todaysWeatherEl.append(currentDate)
    todaysWeatherEl.append(cityName);
    todaysWeatherEl.append(iconImg);
    todaysWeatherEl.append(temp);
    todaysWeatherEl.append(humidity);
    todaysWeatherEl.append(windSpeed);
}

// const renderWeather = (data) => {
//     renderToday(data);
//     renderForecast(data);
// }

const getWeather = (location) => {
    let { lat } = location;
    let { lon } = location;
    let city = location.name;

    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=6bb1b7f8b26934ef2b1028b12a559a0f`

    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // renderWeather(data);
            renderToday(data);
        })

}

const getForecast = (location) => {
    let { lat } = location;
    let { lon } = location;

    // let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=6bb1b7f8b26934ef2b1028b12a559a0f`
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=6bb1b7f8b26934ef2b1028b12a559a0f`

    fetch(forecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            renderForecast(data);
        })
}

const getCoords = (input) => {
    todaysWeatherEl.textContent = '';

    let coordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=6bb1b7f8b26934ef2b1028b12a559a0f`

    fetch(coordsUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            getWeather(data[0]);
            getForecast(data[0]);
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
        // citiesEl.setAttribute('data-city', searchHistory[i])
        citiesEl.classList.add('btn', 'mb-3')
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
searchHistoryEl.addEventListener('click', (e) => {
    let city = e.target.textContent
    getCoords(city);
})