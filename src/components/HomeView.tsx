import React from "react";
import { Link } from "react-router-dom";
import { Recipe } from "../modules";
import svgLogo from "../resources/logo_white.svg";
import "./HomeView.css";
import Search from "./Search";

interface Props {
    recipes: Recipe[];
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

export default function HomeView(props: Props) {
    const recipeTiles: JSX.Element[] = [];
    for (const recipe of props.recipes) {
        let summary: string[] = recipe.ingredients.map(val => val.name);
        summary = summary.concat(recipe.garnish).slice(0, 2);

        recipeTiles.push(
            <Link
                to={`/drink/${recipe.name.replace(/ /g, "_")}`}
                key={recipe.name}
            >
                <div className="recipeTile">
                    <h3>{recipe.name}</h3>
                    <ul>
                        {summary.map((val, index) => (
                            <li key={index}>{val}</li>
                        ))}
                        <li className="ellipse" key={3}>
                            ...
                        </li>
                    </ul>
                </div>
            </Link>
        );
    }
    return (
        <span>
            <div className="bgImage">
                <img src={svgLogo} className="logo" />
                <Search tags={props.tags} onTagsChange={props.onTagsChange} />
            </div>
            <div className="recipeList">{recipeTiles}</div>
        </span>
    );
}
