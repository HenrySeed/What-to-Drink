import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Recipe } from "../modules";
import "./RecipeView.css";

interface Props {
    recipes: Map<string, Recipe>;
}

function RecipeView(props: Props) {
    const ingredientElems = [];
    const path = useLocation().pathname.split("/");
    const recipeKey = path[path.length - 1];
    const recipe = props.recipes.get(recipeKey);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (recipe) {
        for (const val of recipe.ingredients) {
            ingredientElems.push(
                <span>
                    {val.amount}&nbsp;
                    {val.unit}&nbsp;
                    {val.ingredient}
                </span>
            );
        }
        return (
            <div className="Recipe">
                <h2>{recipe.name}</h2>
                <em>{recipe.category}</em>
                <h3>Ingredients</h3>
                <ul>
                    {ingredientElems.map((val, index) => (
                        <li key={index}>{val}</li>
                    ))}
                </ul>
                <h3>Preparation</h3>
                <p>{recipe.preparation}</p>
                {recipe.garnish ? (
                    <p>Garnish with a {recipe.garnish}</p>
                ) : (
                    <span />
                )}
            </div>
        );
    } else {
        return <span>404 could not find recipe {recipeKey}</span>;
    }
}

export default RecipeView;
