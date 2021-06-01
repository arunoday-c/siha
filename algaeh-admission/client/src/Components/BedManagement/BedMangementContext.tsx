import React, { createContext, useReducer } from "react";

const baseState: any = {
  wardHeaderData: [],
  bedStatusData: [],
  selectedBedData: [],
};

export const BedManagementContext = createContext(baseState);

const TYPES = {
  setWardHeaderData: "setWardHeaderData",
  setBedStatusData: "setBedStatusData",
  setSelectedBedData: "setSelectedBedData",

  clearState: "clearState",
};

function reducer(
  state: any,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case TYPES.setWardHeaderData:
      return { ...state, wardHeaderData: payload };
    case TYPES.setBedStatusData:
      return { ...state, bedStatusData: payload };
    case TYPES.setSelectedBedData:
      if (payload === null) {
        return { ...state, selectedBedData: [] };
      } else {
        return { ...state, selectedBedData: [payload] };
      }

    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const BedContextProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setWardHeaderData(e: any) {
      dispatch({ type: TYPES.setWardHeaderData, payload: e });
    },
    setBedStatusData(e: any) {
      dispatch({ type: TYPES.setBedStatusData, payload: e });
    },
    setSelectedBedData(e: any) {
      dispatch({ type: TYPES.setSelectedBedData, payload: e });
    },

    clearState() {
      dispatch({ type: TYPES.clearState, payload: "" });
    },
  };
  return (
    <BedManagementContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </BedManagementContext.Provider>
  );
};
