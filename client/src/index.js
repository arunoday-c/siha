import React from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { AlagehReducers } from "./reducers/algaehReducers";
import logger from "redux-logger";
import routes from "./routes.js";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import "./index.css";
import "./styles/site.css";

import { getTokenDetals } from "./actions/Login/Loginactions.js";
getTokenDetals();

const middleware = applyMiddleware(thunk, logger);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#00BCB0",
      main: "#00BCB0",
      dark: "#3A95AA",
      contrastText: "#fff"
    }
  }
});

const store = createStore(AlagehReducers, middleware);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>{routes}</Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
