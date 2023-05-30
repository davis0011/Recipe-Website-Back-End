const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRecipeArrayRand(n) {
    let set = new Set();
    console.log(n)
    while (set.size < n) {
        set = set.add(Math.floor(Math.random() * (100000)) + 1);
    }
    let result = Array.from(set);
    for (let i = 0; i < result.length; i++) {
        try{
            result[i] = await getRecipeDetails(result[i]);
        }
        catch{
            result[i] = Math.floor(Math.random() * (100000)) + 1;
            i--;
        }
      }
    return Promise.all(result);
}

async function getSearchResults(params){
    params.apiKey = process.env.spooncular_apiKey;
    return await axios.get(`${api_domain}/recipes/complexSearch`, { params });
}


exports.getSearchResults = getSearchResults;
exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeArrayRand = getRecipeArrayRand;



