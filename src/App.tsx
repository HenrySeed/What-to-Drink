import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import HomeView from "./components/HomeView";
import RecipeView from "./components/RecipeView";
import { Recipe } from "./modules";

function App() {
    const recipesJSON = require("./data/recipes.json");
    const recipes: Recipe[] = Array.from(recipesJSON).map(
        val => new Recipe(val)
    );
    const recipeMap = new Map(
        recipes.map(val => [val.name.replace(/ /g, "_"), val])
    );

    // =========================  Rendering  ========================= //
    return (
        <Router>
            <div className="App">
                <span className="appBody">
                    <Switch>
                        <Route path="/drink/">
                            <RecipeView recipes={recipeMap} />
                        </Route>
                        <Route path="/">
                            <HomeView recipes={recipes} />
                        </Route>
                    </Switch>
                </span>

                <footer>
                    <div className="footerContainer">
                        <Link to="/" className="logo">
                            What to Drink
                        </Link>
                        <div>&#169; Henry Seed 2020</div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
