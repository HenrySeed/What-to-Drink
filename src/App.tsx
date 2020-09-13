import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import HomeView from "./components/HomeView";
import RecipeView from "./components/RecipeView";
import { Recipe } from "./modules";
import svgLogo from "./resources/logo_white.svg";
import {
    generateKeywordMap,
    getSearchedRecipes,
    loadRecipes
} from "./utilities";

const [recipes, recipeMap] = loadRecipes();
const keywordMap = generateKeywordMap(recipes);

function App(props: any) {
    const [tags, setTags] = useState<string[]>([]);
    const [searchResult, setsearchResult] = useState<Recipe[]>([]);

    useEffect(() => {
        let urltags = [];
        if (props.location && props.location.search) {
            urltags = JSON.parse(
                decodeURIComponent(props.location.search).replace(
                    "?search=",
                    ""
                )
            );
        }
        setTags(urltags);
        setsearchResult(getSearchedRecipes(urltags, keywordMap));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        props.history.replace(
            "?search=" + encodeURIComponent(JSON.stringify(tags))
        );
        setsearchResult(getSearchedRecipes(tags, keywordMap));
    }, [tags]); // eslint-disable-line react-hooks/exhaustive-deps

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
                            tags={tags}
                            onTagsChange={val => setTags(val)}
                            recipes={
                                searchResult.length > 0 ? searchResult : recipes
                            }
                        />
                    </Route>
                </Switch>
            </span>

            <footer>
                <div className="footerContainer">
                    <img className="logo" src={svgLogo} />
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
