import add from "@iconify/icons-mdi/add";
import close from "@iconify/icons-mdi/close-circle";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { IngredientData } from "../modules";
import "./Search.css";

interface TagProps {
    name: string;
    action: (name: string) => void;
    tagIcon: any;
}
function Tag(props: TagProps) {
    return (
        <span className="tag" onClick={() => props.action(props.name)}>
            {props.name}
            <Icon icon={props.tagIcon} className="tagClose" />
        </span>
    );
}

interface Props {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

function Search(props: Props) {
    const [suggestions, setsuggestions] = useState<string[]>([]);
    const [searchVal, setsearchVal] = useState<string>("");

    // list of ingredients used for auto-complete
    const ingrJSON = require("../data/ingredients.json");
    const ingredients: IngredientData[] = [];
    for (const key in ingrJSON) {
        ingredients.push({
            name: key.toLowerCase(),
            taste: ingrJSON[key].taste,
            abv: ingrJSON[key].abv
        });
    }

    function removeTag(tag: string) {
        // we use [...props.tags] so it makes a new array and
        // the setState on the other end recognises this
        const newTags = [...props.tags];
        newTags.splice(props.tags.indexOf(tag), 1);
        props.onTagsChange(newTags);
    }

    function handleInputChange(inVal: string) {
        setsearchVal(inVal);
        // props.onSearch(inVal);
        const val = inVal.trim().toLowerCase();
        if (val === "") {
            setsuggestions([]);
        } else {
            const suggestions: Set<string> = new Set();
            const possibleIngr = ingredients.filter(
                val => !props.tags.includes(val.name)
            );
            // first check for complete matches
            for (const ingredient of possibleIngr) {
                if (ingredient.name.slice(0, val.length) === val) {
                    suggestions.add(ingredient.name);
                }
            }
            // now check for partial matches
            for (const ingredient of possibleIngr) {
                if (ingredient.name.includes(val)) {
                    suggestions.add(ingredient.name);
                }
            }
            setsuggestions(Array.from(suggestions));
        }
    }

    return (
        <span className="inputContainer">
            <input
                autoFocus
                value={searchVal}
                placeholder="I have some..."
                onChange={event => handleInputChange(event.target.value)}
            />
            {searchVal ? (
                <span onClick={() => handleInputChange("")}>
                    <Icon className="closeIcon" icon={close} />
                </span>
            ) : (
                <span />
            )}
            {suggestions.length > 0 ? (
                <div className="searchDropDown">
                    <ul>
                        {suggestions.map(val => (
                            <Tag
                                name={val}
                                key={val}
                                action={name => {
                                    props.onTagsChange(
                                        props.tags.concat([val])
                                    );
                                    handleInputChange("");
                                }}
                                tagIcon={add}
                            />
                        ))}
                    </ul>
                </div>
            ) : (
                <span />
            )}

            <div className="tags">
                {props.tags.map(val => (
                    <Tag
                        name={val}
                        key={val}
                        action={removeTag}
                        tagIcon={close}
                    />
                ))}
            </div>
        </span>
    );
}

export default Search;
