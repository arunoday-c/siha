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

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: "#34b8bc",
//       main: "#34b8bc",
//       dark: "#3A95AA",
//       contrastText: "#fff"
//     }
//   }
// });

const store = createStore(AlagehReducers, middleware);

ReactDOM.render(
  // <MuiThemeProvider theme={theme}>
  <Provider store={store}>{routes}</Provider>,
  // </MuiThemeProvider>,
  document.getElementById("root")
);

// serviceWorker.register();
