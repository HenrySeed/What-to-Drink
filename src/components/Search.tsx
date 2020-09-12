import close from "@iconify/icons-mdi/close-circle";
import { Icon } from "@iconify/react";
import React from "react";
import "./Search.css";

interface Props {
    searchVal: string;
    onSearch: (val: string) => void;
}

function Search(props: Props) {
    return (
        <span>
            <input
                autoFocus
                placeholder="I have some..."
                value={props.searchVal}
                onChange={event => props.onSearch(event.target.value)}
            />
            {props.searchVal ? (
                <span onClick={() => props.onSearch("")}>
                    <Icon className="closeIcon" icon={close} />
                </span>
            ) : (
                <span />
            )}
        </span>
    );
}

export default Search;
