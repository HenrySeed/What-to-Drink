import React, { useState } from "react";
import "./App.css";
import RecipeView from "./components/RecipeView";
import { Recipe } from "./modules";
const recipesJSON = require("./data/recipes.json");

function App() {
    const [openRecipe, setOpenRecipe] = useState<Recipe>();
    const recipes: Recipe[] = recipesJSON;
    const recipeMap = new Map(recipes.map(val => [val.name, val]));

    function toggleRecipe(name: string) {
        const recipeObj = recipeMap.get(name);
        if (recipeObj) {
            setOpenRecipe(recipeObj);
        }
    }

    // =========================  Rendering  ========================= //
    const recipeTiles: JSX.Element[] = [];
    for (const recipe of recipes) {
        const ingredientNames = recipe.ingredients
            .map(val => val.ingredient)
            .concat([recipe.garnish])
            .slice(0, 3);
        recipeTiles.push(
            <div
                className="recipeTile"
                key={recipe.name}
                onClick={val => toggleRecipe(recipe.name)}
            >
                <h3>{recipe.name}</h3>
                {ingredientNames.join(", ")}
                ...
            </div>
        );
    }
    return (
        <div className="App">
            <div className="bgImage" />
            <div className="bgFilter" />
            <div className="contentContainer">
                {openRecipe ? (
                    <RecipeView
                        recipe={openRecipe}
                        onClose={() => setOpenRecipe(undefined)}
                    />
                ) : (
                    <div className="recipeList">{recipeTiles}</div>
                )}
            </div>
        </div>
    );
}

export default App;
