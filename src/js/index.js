// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import {
    elements,
    renderLoader,
    clearLoader
} from './view/base';

/**
 * To maintain the Global state of the app
 * -- Search Object
 * -- Current recipe Object
 * -- Shopping list Object
 * -- Liked recipes
 * 
 */

const state = {};
/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. Get Query from View
    const query = searchView.getInput();
    console.log(query);
    if (query) {

        //2. New Search Object and add to state
        state.search = new Search(query);

        //3. Prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        recipeView.clearRecipe();
        renderLoader(elements.searchRes);


        //4. Search for recipies
        try{
            await state.search.getResults();
            //5. Render results on UI
            console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(err){
            console.log(err);
            alert("Something went woring with getResults " + err);
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    //prevent the page from reload
    e.preventDefault();
    controlSearch();
});

elements.searchResultPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const pageNumber = parseInt(btn.dataset.goto);
        //console.log(pageNumber);
        searchView.clearResults();
        searchView.renderResults(state.search.result, pageNumber, 10);
    }
});

/**
 * Recipe Controller
 */

const controlRecipe = async () =>{
    //Get the Recipe Id from the URL
    const id = window.location.hash.replace('#','');
    console.log(id);
    if(id){

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search){
            searchView.highlightSelected(id);
        }
        state.recipe = new Recipe(id);
        try{
            //Get the Recipe and pase the Ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe);
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            console.log(state.recipe);
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        }catch(err){
            console.log(err);
            alert("Something went wrong with GetRecipe !!!" + err);
            clearLoader();
        }
    }
};
//window.addEventListener('hashchange',controlRecipe);
//Listener for onLoad and hashchange to fetch the recipe details
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    if(state.likes && state.likes.likes){
        // Render the existing likes
        state.likes.likes.forEach(like => likesView.renderLike(like));
    }    
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});