import React, { useContext } from "react";
import { useQuery } from "react-query";
import _ from "lodash";
import "./PortalSetup.scss";
import {
  getPortalExists,
  addOrUpdatePortalSetup,
  getServiceTypeDropDown,
  getSubInsuranceGrid,
  syncServicesToPortal,
  // updatePortal,
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
  // let [, setState] = useState();
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
        // setState({});
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
      setPortalState({
        ...portalState,
        portal_exists: _.head(data).portal_exists,
      });
      // setPortal_exists(data[0].portal_exists);
    },
    onError: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });

  const updateFunction = async () => {
    try {
      setPortalState({ ...portalState, saveLoading: true });
      const insertArray = portalState?.gridData
        .filter((f) => f.checked === "Y")
        .map((item) => {
          return {
            ...item,
            service_types: JSON.stringify(item.service_type),
          };
        });

      const updateArray = portalState?.gridData
        .filter((f) => f.isDirty === "Y")
        .map((item) => {
          return {
            ...item,
            service_types: JSON.stringify(item.service_type),
          };
        });

      if (insertArray.length === 0 && updateArray.length === 0) {
        throw new Error("Nothing To Update");
      }
      await addOrUpdatePortalSetup(
        {
          insertArray,
          updateArray,
        },
        refetch
      );
      AlgaehMessagePop({
        display: "Update is in progress...",
        type: "success",
      });
    } catch (e) {
      AlgaehMessagePop({
        display: e.message,
        type: "error",
      });
    } finally {
      setPortalState({ ...portalState, saveLoading: false });
    }
  };
  async function syncPortalServices() {
    try {
      const records = await syncServicesToPortal();
      AlgaehMessagePop({
        display: records.message,
        type: "error",
      });
    } catch (e) {
      AlgaehMessagePop({
        display: e.message,
        type: "success",
      });
    }
  }
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
              refetch={refetch}
            />
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                className="btn btn-primary"
                onClick={syncPortalServices}
                disabled={portalState?.portal_exists === "N"}
              >
                Publish Services List to Portal
              </button>
              <button
                className="btn btn-primary"
                onClick={updateFunction}
                disabled={portalState?.portal_exists === "N"}
              >
                Publish Corporate List to Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
