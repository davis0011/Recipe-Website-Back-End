const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function get3LastViewd(user_id){
    const recipes_id = await DButils.execQuery(`select last1,last2,last3 from users where user_id='${user_id}'`);
    // const recipes_id2 = await DButils.execQuery(`select last2 from users where user_id='${user_id}'`);
    // const recipes_id3 = await DButils.execQuery(`select last3 from users where user_id='${user_id}'`);
    // recipe_id = [recipes_id1,recipes_id2,recipes_id3]
    return recipes_id;
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.get3LastViewd = get3LastViewd;
