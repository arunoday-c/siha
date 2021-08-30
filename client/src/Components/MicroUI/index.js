import React, { useEffect, useContext } from "react";
import { MainContext } from "algaeh-react-components";
import loadMicroFrontend from "./MicroFrontendService";
import Config from "../../utils/config.json";
import globalVariables from "../../utils/GlobalVariables.json";
// import { algaehApiCall } from "../../utils/algaehApiCall";
window[`baseImplement`] = {
  ...Config["routersAndPorts"],
  core: Config.routersAndPorts.default,
  base: Config.baseUrl,
};
window["unStarted"] = [];
const MicroFrontend = ({ history, host, path }) => {
  const mainCtx = useContext(MainContext);
  const _cnf = Config.routersAndPorts[host];
  const appId = _cnf?.name.replace(/ /g, "");
  const elementId = `micro-container-${appId}`;
  const _portOrLocation = window.location.port ? _cnf?.port : _cnf?.path;
  let hostUrl = window.location.port
    ? `http://${window.location.hostname}:${_portOrLocation}/microBuild/`
    : `/${_portOrLocation}/microBuild/`;
  if (process.env.NODE_ENV === "development") {
    const devLocalhostId = _cnf?.client;
    hostUrl = `http://localhost:${devLocalhostId}/`;
  }
  function getMainContext(type = undefined) {
    if (type) return mainCtx;
    else return mainCtx[type];
  }
  function getGlobalVariables(type = undefined) {
    if (!type) return globalVariables;
    else return globalVariables[type];
  }
  useEffect(() => {
    loadMicroFrontend(hostUrl, () => {
      window[`mount_${appId}`]({
        elementId,
        path,
        // mainContext: mainCtx,
        getGlobalVariables: getGlobalVariables,
        getMainContext: getMainContext,
      });
    });

    return () => {
      window[`unmount_${appId}`]({ elementId });
    };
  }, [
    // history,
    hostUrl,
    appId,
    elementId,
  ]);

  return <div id={elementId}>Loading micro...</div>;
};

export default MicroFrontend;
