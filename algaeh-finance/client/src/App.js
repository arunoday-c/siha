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
          <Link className="nav-link active" to="/accounts">
            Accounts
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/transactions">
            Transactions
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/journal">
            Journal Ledger
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reports">
            Financial Reports
          </Link>
        </li>{" "}
        <li className="nav-item">
          <Link className="nav-link" to="/options">
            Finance Options
          </Link>
        </li>
      </ul>
    </>
  );
}

export default App;
