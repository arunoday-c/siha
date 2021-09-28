import { createContext, useReducer } from "react";

const baseState: any = {
  wardHeaderData: [],
  bedStatusData: [],
  wardHeaderDropdown: [],
  ward_header_id: null,
  hims_adm_bed_status_id: "All",
  fromAdmission: false,
  // selectedBedData: [],
};

export const BedManagementContext = createContext(baseState);

const TYPES = {
  setWardHeaderData: "setWardHeaderData",
  setBedStatusData: "setBedStatusData",
  // setSelectedBedData: "setSelectedBedData",
  setWardHeaderId: "setWardHeaderId",
  setBedStatusId: "setBedStatusId",
  clearState: "clearState",
  setFromPatientAdmission: "setFromPatientAdmission",
  setWardHeaderDropdown: "setWardHeaderDropdown",
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
    case TYPES.setWardHeaderDropdown:
      return { ...state, wardHeaderDropdown: payload };
    case TYPES.setWardHeaderId:
      return { ...state, ward_header_id: payload };
    case TYPES.setBedStatusId:
      return { ...state, hims_adm_bed_status_id: payload };
    case TYPES.setFromPatientAdmission:
      return { ...state, fromAdmission: payload };

    // case TYPES.setSelectedBedData:
    //   if (payload === null) {
    //     return { ...state, selectedBedData: {} };
    //   } else {
    //     return { ...state, selectedBedData: { ...payload } };
    //   }

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
    setWardHeaderDropdown(e: any) {
      dispatch({ type: TYPES.setWardHeaderDropdown, payload: e });
    },
    setWardHeaderId(e: any) {
      dispatch({ type: TYPES.setWardHeaderId, payload: e });
    },
    setBedStatusId(e: any) {
      dispatch({ type: TYPES.setBedStatusId, payload: e });
    },
    setFromPatientAdmission(e: any) {
      dispatch({ type: TYPES.setFromPatientAdmission, payload: e });
    },
    // setSelectedBedData(e: any) {
    //   dispatch({ type: TYPES.setSelectedBedData, payload: e });
    // },

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
