import { Recipe } from "./modules";

export function loadRecipes(): [Recipe[], Map<string, Recipe>] {
    const recipesJSON = require("./data/recipes.json");
    const recipes = Array.from(recipesJSON as any).map(val => new Recipe(val));
    const recipesShuffled = fisherYatesShuffle(recipes);
    const recipeMap = new Map(recipesShuffled.map(val => [val.key, val]));
    return [recipesShuffled, recipeMap];
}

export function generateKeywordMap(recipes: Recipe[]): Map<string, Recipe[]> {
    // Map of keywords => recipes for searching
    const keywordMap = new Map<string, Recipe[]>();
    for (const recipe of recipes) {
        let keywords: string[] = recipe.ingredients.map(val => val.name);
        keywords = keywords.concat(recipe.name.split(" "));
        keywords = keywords.concat(
            recipe.garnish ? recipe.garnish.split(" ") : []
        );
        keywords = keywords.map(val => val.toLowerCase().replace(/\s/g, ""));

        for (const key of keywords) {
            const mapVal = keywordMap.get(key);
            if (mapVal) {
                keywordMap.set(key, mapVal.concat(recipe));
            } else {
                keywordMap.set(key, [recipe]);
            }
        }
    }
    return keywordMap;
}

export function fisherYatesShuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
