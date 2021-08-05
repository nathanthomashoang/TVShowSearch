const form = document.querySelector('#searchForm');
const searchSelection = document.querySelectorAll('#searchForm .dropdown-item')
const searchDisplay = document.querySelector('#searchForm .dropdown-toggle')
const resultsDisplay = document.querySelector('#results .row')
const dateDisplay = document.querySelector('#todayDate')
const jumboCarousel = document.querySelector('#jumboCarousel');
let searchType = 'Show Title';
const todayDate = new Date().toString().slice(4,15);
const searchDate = new Date().toJSON().slice(0,10);

dateDisplay.innerHTML = todayDate;

// Schedule search - API request to TV Maze
const getSchedule = async (config) => {
    try{
        const results = await axios.get('https://api.tvmaze.com/schedule/', config);
        return results.data;
    }catch(error) {
        console.log('There has been an error:', error);
    }
} 

// Show Title search - API request to TV Maze
const getShows = async (config) => {
    try{
        const results = await axios.get('https://api.tvmaze.com/search/shows', config);
        return results.data;
    }catch(error) {
        console.log('There has been an error:', error);
    }
}

// People search - API request to TV Maze
const getPeople = async (config) => {
    try{
        const results = await axios.get('https://api.tvmaze.com/search/people', config);
        return results.data;
    }catch(error) {
        console.log('There has been an error:', error);
    }
}

// create horizonal card
const createHorizontalCard = (title, url, subtitle, body, image) => {
    // card
    const card = document.createElement('div');
    card.classList.add('card', 'mb-2', 'hCard', 'p-0', 'mx-1');
    // row div
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row','g-0');
    // col-4 div
    const colFirstDiv = document.createElement('div');
    colFirstDiv.classList.add('col-4','align-items-center','d-flex');
    // col-8 div
    const colSecDiv = document.createElement('div');
    colSecDiv.classList.add('col-8');
    // card-img
    const img = document.createElement('IMG');
    img.src = image;
    img.classList.add('img-fluid','rounded-start');
    // card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // card-body content
    const cardTitle = document.createElement('h5');
    const cardTitleLink = document.createElement('a');
    cardTitleLink.href = url;
    cardTitleLink.target = '_blank';
    cardTitleLink.rel = 'noreferrer noopener'
    cardTitleLink.innerHTML = title;
    cardTitleLink.classList.add('stretched-link')
    cardTitle.classList.add('card-title');
        // card-body subtitle
    const cardSubtitle = document.createElement('h6');
    cardSubtitle.classList.add('card-subtitle','mb-2','text-muted');
    cardSubtitle.innerHTML = subtitle;
        // card-body text
    const cardText = document.createElement('p');
    cardText.classList.add('card-text', 'm-0');
    cardText.innerHTML = body;

    cardTitle.append(cardTitleLink);
    cardBody.append( cardTitle, cardSubtitle, cardText);
    colFirstDiv.append(img);
    colSecDiv.append(cardBody);
    rowDiv.append(colFirstDiv, colSecDiv);
    card.append(rowDiv);
    resultsDisplay.append(card);
}

// create standard card
const createCard = (col, className, title, url, subtitle, body, image) => {
    const numCol = {
        1: 'col-lg-12',
        2: 'col-lg-6',
        3: 'col-lg-4',
        4: 'col-lg-3',
        6: 'col-lg-2',
    }
    // col
    const column = document.createElement('div');
    column.classList.add('p-2','col-md-6', numCol[col]);
    // card
    const card = document.createElement('div');
    card.classList.add('card', 'h-100', className);
    // card-img wrap
    const cardImgWrap = document.createElement('div');
    cardImgWrap.classList.add('card-img-wrap');
    // card-img
    const img = document.createElement('IMG');
    img.src = image;
    img.classList.add('card-img-top','img-fluid');
    // card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // card-body content
    const cardTitle = document.createElement('h5');
    const cardTitleLink = document.createElement('a');
    cardTitleLink.href = url;
    cardTitleLink.target = '_blank';
    cardTitleLink.rel = 'noreferrer noopener'
    cardTitleLink.innerHTML = title;
    cardTitleLink.classList.add('stretched-link')
    cardTitle.classList.add('card-title');
        // card-body subtitle
    const cardSubtitle = document.createElement('h6');
    cardSubtitle.classList.add('card-subtitle','mb-2','text-muted');
    cardSubtitle.innerHTML = subtitle;
        // card-body text
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerHTML = body;

    cardTitle.append(cardTitleLink);
    column.append(card);
    cardBody.append(cardTitle, cardSubtitle, cardText);
    cardImgWrap.append(img)
    card.append(cardImgWrap, cardBody);
    resultsDisplay.append(column);
}

// show search results
const createShowResults = async (config) => {
    const shows = await getShows(config);

    const resultsHeader = document.createElement('h2');
    resultsHeader.innerHTML = (shows[0]) ? 'Most relevant results:' : 'No results found';
    resultsDisplay.append(resultsHeader);

    for (let result of shows) {
        const show = result.show;
        const image = (show.image) ? show.image.medium : 'images/francisco-andreotti-MwrpaS_6f2U-unsplash.jpg';
        const date = (show.premiered) ? `- ${show.premiered.slice(0,4)}` : '';
        const genre = (show.genres.length > 0) ? `(${show.genres[0]})` : '';
        const subtitle = `${show.type} ${genre} ${date}`;
        const sumAddon = (show.summary && show.summary.length > 125) ? '(cont.)' : '';
        const sumSnippet = (show.summary) ? `${show.summary.substring(0,125)} ${sumAddon}`: '';
        createHorizontalCard(show.name, show.url, subtitle, sumSnippet, image);
    }
}

// people search results
const createPeopleResults = async (config) => {
    const people = await getPeople(config);

    const resultsHeader = document.createElement('h2');
    resultsHeader.innerHTML = (people[0]) ? 'Most relevant results:' : 'No results found';
    resultsDisplay.append(resultsHeader);

    for (let result of people) {
        const person = result.person;
        if (person.image) {
            const image = person.image.medium;
            const bday = (person.birthday) ? `b. ${person.birthday.slice(0,4)},` : '';
            const country = (person.country) ? `${person.country.name}` : '';
            const subtitle = `${bday} ${country}`;
            createCard(4, 'celebCard', person.name, person.url, subtitle, '', image);
        }
    }
}

// schedule results & update Jumbotron Carousel
const createScheduleResults = async (config) => {
    const schedule = await getSchedule(config);
    
    if (schedule.length > 0) {
        const scheduleByWeight = schedule.slice(0);
        scheduleByWeight.sort(function(a, b) {
            return b.show.weight - a.show.weight
        })

        const carouselLabels = document.querySelectorAll('#jumboCarousel .carousel-item a');
        const carouselImages = document.querySelectorAll('#jumboCarousel .carousel-item img');
        const carouselSubtitles = document.querySelectorAll('#jumboCarousel .carousel-item p');

        for (let i = 0; i < 3; i++) {
            const result = scheduleByWeight[i];
            carouselLabels[i].innerHTML = (result.show.name) ? result.show.name : '';
            carouselLabels[i].href = result.url;
            carouselImages[i].src = (result.show.image) ? result.show.image.original : 'images/francisco-andreotti-MwrpaS_6f2U-unsplash.jpg';
            const episodeNum = (result.number) ? `, Episode ${result.number}` : '';
            const seasonEp = `Season ${result.season}${episodeNum}`;
            const subtitle = `${seasonEp}: ${result.name}`;
            carouselSubtitles[i].innerHTML = subtitle;
        }

        for (let result of scheduleByWeight.slice(3)) {
            const show = result.show;
            const image = (show.image) ? show.image.medium : 'images/francisco-andreotti-MwrpaS_6f2U-unsplash.jpg';
            const episodeNum = (result.number) ? `, Episode ${result.number}` : '';
            const seasonEp = `Season ${result.season}${episodeNum}`;
            const subtitle = `${seasonEp}`;
            createCard(4, 'scheduleCard', show.name, result.url, subtitle, result.name.substring(0,50), image);
        }   
    }
}

// search selection
for (let selection of searchSelection) {
    selection.addEventListener('click', function(e) {
        e.preventDefault();
        searchDisplay.innerHTML = this.innerHTML;
        searchType = this.innerHTML;
    })
}

// clear results
const clearResults = () => {
    while (resultsDisplay.firstChild) {
        resultsDisplay.removeChild(resultsDisplay.firstChild);
    }
}

// submit button
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearResults();
    jumboCarousel.classList.add('d-none');
    const searchTerm = form.elements.q.value;
    const searchConfig = { params: { q: searchTerm } };
    if (searchType === 'Show Title') {
        resultsDisplay.classList.add('justify-content-center');
        createShowResults(searchConfig);
    } else if (searchType === 'Celebrities') {
        resultsDisplay.classList.remove('justify-content-center');
        createPeopleResults(searchConfig);
    }
    form.elements.q.value = '';
})

const searchConfig = { params: {} };
createScheduleResults(searchConfig);