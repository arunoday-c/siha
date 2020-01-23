import React, { useContext } from "react";
import { MainContext } from "algaeh-react-components/context";
import { numberFormater } from "./GlobalFunctions";
export default function({ value, options }) {
  const userContext = useContext(MainContext);
  return <>{numberFormater(value, options)}</>;
}
