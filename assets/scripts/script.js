let submitEl = document.getElementById('submit');
let searchInputEl = document.getElementById('search-input');
let searchHistoryEl = document.getElementById('search-history');
let clearHistoryEl = document.getElementById('clear-history');

let searchHistory = [];

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
        citiesEl
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