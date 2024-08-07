const searchBox = document.querySelector('.searchbox');
const searchBtn = document.querySelector('button'); 
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details');

// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";
        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                recipeDiv.appendChild(button);
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
        }
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes. Please try again later.</h2>";
        console.error(error);
    }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <button class="recipe-close-btn">&times;</button>
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
        <div class="recipeinstruction">
            <h3>Instructions:</h3>
            <p >${meal.strInstructions}</p>
        </div>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    `;
    recipeDetailsContent.style.display = "block";

    // Add event listener for the dynamically added close button
    const recipeCloseBtn = recipeDetailsContent.querySelector('.recipe-close-btn');
    recipeCloseBtn.addEventListener('click', () => {
        recipeDetailsContent.style.display = "none";
    });
};

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = "<h2>Please enter a search term.</h2>";
    }
});
