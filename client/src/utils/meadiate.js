import React, { useContext } from "react";
import { MainContext } from "algaeh-react-components";
import { numberFormater } from "./GlobalFunctions";
export default function ({ value, options }) {
  const userContext = useContext(MainContext);

  debugger

  return <>{numberFormater(value, options, userContext.userToken)}</>;
}
