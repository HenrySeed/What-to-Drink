import { Recipe } from "./modules";

export function getSearchedRecipes(
    intags: string[],
    keywordMap: Map<string, Recipe[]>
): Recipe[] {
    // preprocessing
    let tags = intags.filter(val => val.trim() !== "");
    tags = tags.filter(val => val !== undefined && val !== null);
    if (tags.length < 1) {
        return [];
    } else {
        let results: Map<
            string,
            { recipe: Recipe; priority: number }
        > = new Map();

        for (const word of tags) {
            if (word.trim() !== "") {
                let keyResult: Recipe[] = [];
                for (const [key, value] of Array.from(keywordMap)) {
                    if (key.includes(word)) {
                        keyResult = keyResult.concat(value);
                    }
                }
                if (keyResult) {
                    for (const recipe of keyResult) {
                        const resultRecipe = results.get(recipe.key);
                        if (resultRecipe) {
                            resultRecipe.priority += 1;
                        } else {
                            results.set(recipe.key, {
                                recipe: recipe,
                                priority: 1
                            });
                        }
                    }
                }
            }
        }

        const resultArray = Array.from(results.values());

        // sort the results by priority
        const sortedResult = resultArray.sort(
            (a, b) => b.priority - a.priority
        );

        return sortedResult.map(val => val.recipe);
    }
}

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
