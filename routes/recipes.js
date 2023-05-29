var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const DButils = require("./utils/DButils");

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
      console.log(user_id);
      last2 = await DButils.execQuery(`select last1 from users where user_id='${user_id}'`);
      last3 = await DButils.execQuery(`select last2 from users where user_id='${user_id}'`);
      await DButils.execQuery(`UPDATE users SET 'last1' = '${req.params.recipeId}' WHERE (user_id = '${user_id}')`);
      await DButils.execQuery(`update users set 'last2' = '${last2}' where (user_id='${user_id}')`);
      await DButils.execQuery(`update users set 'last3' = '${last3}' where (user_id='${user_id}')`);
    }
    console.log(user_id);
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
    // res.send({user: user_id});
  } catch (error) {
    next(error);
  }
});




module.exports = router;
