import React from "react";
import { Link, Redirect } from "react-router-dom";
import "./App.scss";

function App(props) {
  const { path } = props;
  if (path) {
    return <Redirect to={path} />;
  }
  return (
    <>
      <ul className="nav nav-tabs" style={{ marginBottom: 15 }}>
        <li className="nav-item">
          <Link className="nav-link active" to="/assets">
            Assets
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/liability">
            Liability
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/income">
            Income
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/capital">
            Capital
          </Link>
        </li>{" "}
        <li className="nav-item">
          <Link className="nav-link" to="/expense">
            Expense
          </Link>
        </li>
      </ul>
    </>
  );
}

export default App;
