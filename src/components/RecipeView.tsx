import React from "react";
import { Recipe } from "../modules";
import "./RecipeView.css";

interface Props {
    recipe: Recipe;
    onClose: () => void;
}

function RecipeView(props: Props) {
    const ingredientElems = [];
    for (const val of props.recipe.ingredients) {
        if (val.special) {
            ingredientElems.push(<span>{val.special}</span>);
        } else {
            ingredientElems.push(
                <span>
                    {val.amount}&nbsp;
                    {val.unit}&nbsp;
                    {val.ingredient}
                </span>
            );
        }
    }
    return (
        <div className="Recipe">
            <h2>{props.recipe.name}</h2>
            <em>{props.recipe.category}</em>
            <h3>Ingredients</h3>
            <ul>
                {ingredientElems.map((val, index) => (
                    <li key={index}>{val}</li>
                ))}
            </ul>
            <h3>Preparation</h3>
            <p>{props.recipe.preparation}</p>
            {props.recipe.garnish ? (
                <p>Garnish with a {props.recipe.garnish}</p>
            ) : (
                <span />
            )}
            <div onClick={props.onClose}>close</div>
        </div>
    );
}

export default RecipeView;
