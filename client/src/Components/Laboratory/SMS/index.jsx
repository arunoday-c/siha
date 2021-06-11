import React, { memo, createContext, useReducer } from "react";
import HeaderBand from "./headerBand";
import DataList from "./resultList";
const initial = {
  DATE_RANGE: undefined,
  STATUS: "V",
  TOTAL_RECORDS: 0,
  SELECTED_RECORDS: 0,
  TRIGGER_LOAD: undefined,
};
export const LabContext = createContext(initial);
function reducer(state, payload) {
  return { ...state, ...payload };
}
export default memo(function ValidateList(props) {
  const [state, dispatch] = useReducer(reducer, initial);
  const dispatches = {
    setLabState(payload) {
      dispatch({ ...payload });
    },
  };
  return (
    <LabContext.Provider value={{ ...state, ...dispatches }}>
      <HeaderBand {...props} />
      <DataList {...props} />
    </LabContext.Provider>
  );
});
