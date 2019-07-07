import React from "react";
import ReactDOM from "react-dom";
//import { render } from "react-dom";
import { Provider } from "react-redux";
import { AlagehReducers } from "./reducers/algaehReducers";
import logger from "redux-logger";
import routes from "./routes.js";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import "./index.css";
import "./styles/site.css";

// import * as serviceWorker from "./serviceWorker";

const middleware =
  process.env.NODE_ENV === "development"
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

const store = createStore(AlagehReducers, middleware);

ReactDOM.render(
  <Provider store={store}>{routes}</Provider>,
  document.getElementById("root")
);

// serviceWorker.register();
