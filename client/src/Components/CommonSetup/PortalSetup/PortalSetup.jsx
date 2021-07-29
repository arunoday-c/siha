import React, { useContext } from "react";

import { useQuery } from "react-query";

import "./PortalSetup.scss";
import {
  getPortalExists,
  addOrUpdatePortalSetup,
  getServiceTypeDropDown,
  getSubInsuranceGrid,
  updatePortal,
} from "./events";
import { AlgaehMessagePop, Spin } from "algaeh-react-components";
import PortalActive from "./PortalActive";
import PortalGrid from "./PortalGrid";
import { swalMessage } from "../../../utils/algaehApiCall";
import { PortalSetupContext } from "./PortalSetupContext";

export default function PortalSetupComponent() {
  // const [saveLoading, setSaveLoading] = useState(false);
  // const [gridData, setGridData] = useState([]);
  // const [portal_exists, setPortal_exists] = useState("N");
  // const [isDirty, setIsDirty] = useState(false);
  const { portalState, setPortalState } = useContext(PortalSetupContext);
  const { data: serviceTypes } = useQuery(
    "dropdown-data",
    getServiceTypeDropDown,
    {
      refetchOnMount: false,
      initialStale: true,
      cacheTime: Infinity,
      // onSuccess: (data) => {},
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );

  const { refetch, isLoading: reloading } = useQuery(
    ["getSubInsuranceGrid"],
    getSubInsuranceGrid,
    {
      onSuccess: (data) => {
        setPortalState({ ...portalState, gridData: data });
        // setGridData(data);
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );

  // add here loadash

  useQuery(["getPortalExists"], getPortalExists, {
    onSuccess: (data) => {
      debugger;
      setPortalState({ ...portalState, portal_exists: data[0].portal_exists });
      // setPortal_exists(data[0].portal_exists);
    },
    onError: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });

  const updateFunction = () => {
    setPortalState({ ...portalState, saveLoading: true });
    const filteredArray = portalState?.gridData.filter((f) => f.checked);
    if (portalState?.isDirty) {
      updatePortal({ portal_exists: portalState?.portal_exists });

      if (filteredArray.length > 0) {
        addOrUpdatePortalSetup(
          {
            filteredArray: filteredArray,
          },
          refetch
        );
        setPortalState({ ...portalState, saveLoading: false });
      }
    } else {
      if (filteredArray.length > 0) {
        addOrUpdatePortalSetup(
          {
            filteredArray: filteredArray,
          },
          refetch
        );
        setPortalState({ ...portalState, saveLoading: false });
      } else {
        AlgaehMessagePop({
          display: "Nothing To Update...",
          type: "warning",
        });
        setPortalState({ ...portalState, saveLoading: false });
      }
    }
  };
  return (
    <Spin spinning={portalState?.saveLoading || reloading}>
      <div className="PortalSetup">
        <div className="row inner-top-search">
          <PortalActive
            // setIsDirty={setIsDirty}
            portal_exists={portalState?.portal_exists}
            // setPortal_exists={setPortal_exists}
          />
        </div>
        <div className="row ">
          <div className="col-12">
            <PortalGrid
              gridData={portalState?.gridData}
              // setGridData={setGridData}
              serviceTypes={serviceTypes}
              portal_exists={portalState?.portal_exists}
            />
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                className="btn btn-primary"
                onClick={() => {
                  updateFunction();
                }}
                // disabled={portal_exists === "N"}
              >
                Publish to Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
