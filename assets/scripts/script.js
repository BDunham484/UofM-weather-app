let submitEl = document.getElementById('submit');
let searchInputEl = document.getElementById('searchInput');

const formSubmitHandler = (e) => {
    e.preventDefault();
    let input = searchInputEl.value.trim();
}

submitEl.addEventListener('click', formSubmitHandler);