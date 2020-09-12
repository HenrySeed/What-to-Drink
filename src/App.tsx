import React from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import HomeView from "./components/HomeView";
import RecipeView from "./components/RecipeView";
import { Recipe } from "./modules";

function loadRecipes(): [Recipe[], Map<string, Recipe>] {
    const recipesJSON = require("./data/recipes.json");
    const recipes = Array.from(recipesJSON as any).map(val => new Recipe(val));
    const recipeMap = new Map(recipes.map(val => [val.key, val]));
    return [recipes, recipeMap];
}

function generateKeywordMap(recipes: Recipe[]): Map<string, Recipe[]> {
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

function App(props: any) {
    const [recipes, recipeMap] = loadRecipes();
    const keywordMap = generateKeywordMap(recipes);

    function handleSearch(val: string, fromUrl: boolean = false): Recipe[] {
        if (!fromUrl) {
            props.history.replace("?search=" + encodeURIComponent(val));
        }
        const lowerSearch = val.toLowerCase();
        if (lowerSearch.trim() === "") {
            return [];
        } else {
            let results: Map<
                string,
                { recipe: Recipe; priority: number }
            > = new Map();

            for (const word of lowerSearch.split(/ |,/g)) {
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

    let searchVal = "";
    if (props.location && props.location.search) {
        searchVal = decodeURIComponent(props.location.search)
            .replace("?search=", "")
            .replace("%20", " ");
    }
    const searchResult = handleSearch(searchVal, true);

    // =========================  Rendering  ========================= //
    return (
        <div className="App">
            <span className="appBody">
                <Switch>
                    <Route path="/drink/">
                        <RecipeView recipes={recipeMap} />
                    </Route>
                    <Route path="/">
                        <HomeView
                            recipes={
                                searchResult.length > 0 ? searchResult : recipes
                            }
                            onSearch={handleSearch}
                            searchVal={searchVal}
                        />
                    </Route>
                </Switch>
            </span>

            <footer>
                <div className="footerContainer">
                    <Link to="/" className="logo">
                        What to Drink
                    </Link>
                    <div>
                        &#169;{" "}
                        <a
                            href="https://henry.nz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Henry Seed
                        </a>{" "}
                        2020
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <a
                            href="https://github.com/HenrySeed/What-to-Drink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Github
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default withRouter(App);
