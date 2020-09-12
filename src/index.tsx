import { createHashHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import "./index.css";

const hashHistory = createHashHistory();

ReactDOM.render(
    <React.StrictMode>
        <Router history={hashHistory}>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
