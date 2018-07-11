import React from "react";
import ReactDOM from "react-dom";
import loader from "../assets/svg/loader.svg";
const Loader = props => {
  ReactDOM.render(
    <img src={loader} alt="Loading" />,
    document.getElementById(props.id)
  );
};
