import React, { createContext, useReducer } from "react";

const baseState = {
  portalState: {
    saveLoading: false,
    gridData: [],
    portal_exists: "N",
    isDirty: false,
  },
};

export const PortalSetupContext = createContext(baseState);

const TYPES = {
  setPortalState: "setPortalState",
  setInsuranceInfo: "setInsuranceInfo",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setPortalState:
      return { ...state, portalState: { ...payload } };

    default:
      return state;
  }
}

export const PortalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    saveLoading: false,
    gridData: [],
    portal_exists: "N",
    isDirty: false,
  });

  const dispatches = {
    setPortalState(e) {
      dispatch({ type: TYPES.setPortalState, payload: e });
    },

    // clearState() {
    //   dispatch({ type: TYPES.clearState });
    // },
  };
  return (
    <PortalSetupContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </PortalSetupContext.Provider>
  );
};
