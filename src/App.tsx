import React, { useEffect, useState } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import HomeView from "./components/HomeView";
import RecipeView from "./components/RecipeView";
import { Recipe } from "./modules";
import { generateKeywordMap, loadRecipes } from "./utilities";

function App(props: any) {
    const [recipes, recipeMap] = loadRecipes();
    const keywordMap = generateKeywordMap(recipes);
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
        handleSearch(urltags);
    }, []);

    useEffect(() => {
        props.history.replace(
            "?search=" + encodeURIComponent(JSON.stringify(tags))
        );
        handleSearch(tags);
    }, [tags]);

    function handleSearch(intags: string[]) {
        // preprocessing
        let tags = intags.filter(val => val.trim() !== "");
        tags = tags.filter(val => val !== undefined && val !== null);
        if (tags.length < 1) {
            setsearchResult([]);
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

            setsearchResult(sortedResult.map(val => val.recipe));
        }
    }

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
