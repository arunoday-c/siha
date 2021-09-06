import React, { createContext, useReducer } from "react";

const baseState: any = {
  selectedBedData: [],
};

export const PatAdmissionContext = createContext(baseState);

const TYPES = {
  setSelectedBedData: "setSelectedBedData",

  clearState: "clearState",
};

function reducer(
  state: any,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case TYPES.setSelectedBedData:
      if (payload === null) {
        return { ...state, selectedBedData: {} };
      } else {
        return { ...state, selectedBedData: { ...payload } };
      }

    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const PatAdmissionContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setSelectedBedData(e: any) {
      dispatch({ type: TYPES.setSelectedBedData, payload: e });
    },

    clearState() {
      dispatch({ type: TYPES.clearState, payload: "" });
    },
  };
  return (
    <PatAdmissionContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </PatAdmissionContext.Provider>
  );
};
