import React from "react";
import ReactDOM from "react-dom";
import "./loader.css";
const fullPageLoader = document.getElementById("fullPageLoader");

let AlgaehLoader = options => {
  options.show === true
    ? (document.getElementsByTagName("body")[0].style.overflow = "hidden")
    : (document.getElementsByTagName("body")[0].style.overflow = "");
  return ReactDOM.render(
    options.show ? (
      <div className="loader-container">
        <div className="algaeh-progress float shadow">
          <div className="progress__item">loading</div>
        </div>
      </div>
    ) : (
      <React.Fragment />
    ),
    fullPageLoader
  );
};
export default AlgaehLoader;
