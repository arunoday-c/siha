import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { i18next } from "algaeh-react-components"; //eslint-disable-line
import { AlagehReducers } from "./reducers/algaehReducers";
import logger from "redux-logger";
// import ContextBinding from "./contextCheck";
import Routes from "./routes.js";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";

import "./index.scss";
import "./styles/site.scss";
import "./loader.scss";

import "antd/dist/antd.min.css";
import "algaeh-react-components/dist/index.css";
// import * as serviceWorker from "./serviceWorker";
import MainProvider from "./MainProvider";
const middleware =
  process.env.NODE_ENV === "development"
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk);

const store = createStore(AlagehReducers, middleware);

const App = () => (
  <MainProvider>
    <Provider store={store}>
      {/* <ContextBinding> */}
      <Routes />
      {/* </ContextBinding> */}
    </Provider>
  </MainProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

// serviceWorker.register();
