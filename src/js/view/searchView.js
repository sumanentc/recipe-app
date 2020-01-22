import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const highlightSelected = id => {
    //Remove all highlighted records
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    //Highlight the selected recipe
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const displayArrow = (page, type) => {
    const arrow = `
            <button class="btn-inline results__btn--${type}" data-goto=${type ==='prev' ? page -1 : page + 1}>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type ==='prev' ? 'left' : 'right'}"></use>
                </svg>
                <span>Page ${type ==='prev' ? page -1 : page + 1}</span>
            </button>        
            `;

    return arrow;

};

const renderButtons = (page, pageResults, resPerPage) => {
    const pages = Math.ceil(pageResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //First Page
        button = displayArrow(page, 'next');
    } else if (page === pages && pages > 1) {
        // Last Page
        button = displayArrow(page, 'prev');
    } else if (page < pages) {
        // All other pages
        button = `
                ${displayArrow(page,'prev')}
                ${displayArrow(page,'next')}
        `;
    }
    //console.log(button);
    elements.searchResultPage.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipies, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipies.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipies.length, resPerPage);
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResultPage.innerHTML = '';
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            //console.log(acc);
            //console.log(cur);
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            //console.log(acc + cur.length);
            return acc + cur.length;
        }, 0);
        //console.log(newTitle);
        return `${newTitle.join(' ')} ...`;

    } else {
        return title;
    }

};

const renderRecipe = (recipe) => {

    const markup = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};