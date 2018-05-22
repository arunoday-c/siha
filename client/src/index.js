import React from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "material-ui";
import reducers from "./reducers/index.js";
import logger from "redux-logger";
import routes from "./routes.js";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import "./index.css";
import "./styles/site.css";

const middleware = applyMiddleware(thunk, logger);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#00BCB0",
      main: "#00BCB0",
      dark: "#00BFC2",
      contrastText: "#fff"
    }
  }
});

//const persistedState = localStorage.getItem("reduxState")  ? JSON.parse(localStorage.getItem("reduxState")) : {};
const store = createStore(reducers, middleware);

// const store = createStore((state, action) => {
// 	return state;
// }, middleware);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>{routes}</Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
