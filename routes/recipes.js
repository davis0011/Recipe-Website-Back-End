var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


router.get("/rand", async (req, res, next) => {
  try {
    if (req.params.n > 5 || req.params.n < 1){
      throw new Error('Bad request, /rand accepts arrguments between 1 and 5.')
    }
    const recipeArray = await recipes_utils.getRecipeArrayRand(req.params.n);
    if (recipeArray.some(element => element === null || typeof element === 'number' && Number.isInteger(element))){
      throw new Error('Server could not fill the requested list with recipies.')
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
