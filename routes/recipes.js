var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");
const options = {
  cuisine: ["African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European", "European", 
  "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", 
  "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"],
  diet: ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", 
  "Primal", "Low FODMAP", "Whole30"],
  intolerance: ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]
};

router.get("/", (req, res) => res.send("im here"));


router.get("/rand", async (req, res, next) => {
  try {
    // if (req.params.n > 5 || req.params.n < 1){
    //   throw new Error('Bad request, /rand accepts arrguments between 1 and 5.')
    // }
    const recipeArray = await recipes_utils.getRecipeArrayRand(3);
    // if (recipeArray.some(element => element === null || typeof element === 'number' && Number.isInteger(element))){
    //   throw new Error('Server could not fill the requested list with recipies.')
    // }
    res.send(recipeArray);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;//session is currently an empty object.
    if(user_id != undefined && user_id != null){
      last1 = req.params.recipeId;
      last2 = (await DButils.execQuery(`select last1 from users where user_id='${user_id}'`))[0]['last1'];
      last3 = (await DButils.execQuery(`select last2 from users where user_id='${user_id}'`))[0]['last2'];
      if(last1 != last2 && last1 != last3){
        await DButils.execQuery(`UPDATE users SET last1 = '${last1}' WHERE user_id='${user_id}'`);
        await DButils.execQuery(`update users set last2 = '${last2}' where (user_id='${user_id}')`);
        await DButils.execQuery(`update users set last3 = '${last3}' where (user_id='${user_id}')`);
      }
      else{
        if(last1 == last3){
          await DButils.execQuery(`UPDATE users SET last1 = '${last1}' WHERE user_id='${user_id}'`);
          await DButils.execQuery(`update users set last2 = '${last2}' where (user_id='${user_id}')`);
        }
      }
    }
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
    // res.send({user: user_id});
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {//TODO work here
  try {
    const text = req.header('searchText').trim();
    const limit = req.header('limit');
    const cuisines = req.header('cuisine');
    const diets = req.header('diet');
    const intolerances = req.header('intolerance');

    // input validation on the filters
    const ValidText = text.length != 0;
    const ValidLimit = [5,10,15].includes(limit);
    const ValidCuisine = cuisines.every((cuisine) => options.cuisine.includes(cuisine));
    const ValidDiet = diets.every((dietOption) => options.diet.includes(dietOption));
    const ValidIntolerance = intolerances.every((intoleranceOption) => options.intolerance.includes(intoleranceOption));
    
    if (ValidCuisine && ValidDiet && ValidIntolerance && ValidLimit && ValidText){
      const params = {
        query: text,
        number: limit,
        cuisine: cuisines,
        diet: diets,
        intolerances: intolerances
      };
      const results = await recipes_utils.getSearchResults(params);
      res.send(results);
    }
    else {
      throw Error("Invalid Request.")
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
