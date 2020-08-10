import React, { createContext, useReducer } from "react";

export const FrontdeskContext = createContext(null);

const TYPES = {
  setServiceInfo: "setServiceInfo",
  setInsuranceInfo: "setInsuranceInfo",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setServiceInfo:
      const [
        sub_department_id,
        services_id,
        doctor_id,
        department_type,
      ] = payload?.split("-");
      return {
        ...state,
        sub_department_id,
        services_id,
        doctor_id,
        department_type,
      };
    case TYPES.setInsuranceInfo:
      return { ...state, primary_network_office_id: payload };
    default:
      return state;
  }
}

export const FProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    sub_department_id: null,
    services_id: null,
    doctor_id: null,
    department_type: null,
    primary_network_office_id: null,
  });

  const dispatches = {
    setServiceInfo(e) {
      dispatch({ type: TYPES.setServiceInfo, payload: e });
    },
    setInsuranceInfo(e) {
      dispatch({ type: TYPES.setInsuranceInfo, payload: e });
    },
  };
  return (
    <FrontdeskContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </FrontdeskContext.Provider>
  );
};
