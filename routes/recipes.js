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


router.get("/searchRecipe", async (req, res, next) => {//TODO work here
  try {
      const params = {
      query: req.header('searchText').trim(),
      number: req.header('limit'),
      
      // Convert single values to arrays if they are provided as strings
      cuisines: req.header('cuisine') !== "" ? req.header('cuisine').split(',') : [],
      diets: req.header('diet') !== "" ? req.header('diet').split(',') : [],
      intolerances: req.header('intolerance') !== "" ? req.header('intolerance').split(',') : []
    };

    
    

    // input validation on the filters
    const ValidText = params.query.length != 0;
    const ValidNumber = [5,10,15].includes(params.number);
    const ValidCuisines = params.cuisines.every((cuisine) => options.cuisine.includes(cuisine));
    const ValidDiets = params.diets.every((diet) => options.diet.includes(diet));
    const ValidIntolerances = params.intolerances.every((intolerance) => options.intolerance.includes(intolerance));
    
    if (ValidCuisines && ValidDiets && ValidIntolerances && ValidNumber && ValidText){
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




module.exports = router;
