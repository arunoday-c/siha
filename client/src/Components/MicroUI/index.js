import React, { useEffect, useContext } from "react";
import "./MicroUI.scss";
import { MainContext } from "algaeh-react-components";
import loadMicroFrontend from "./MicroFrontendService";
import Config from "../../utils/config.json";
import globalVariables from "../../utils/GlobalVariables.json";
import spotlightSearch from "../../Search/spotlightSearch.json";
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
  function getsportlightSearch(type = undefined) {
    if (!type) return spotlightSearch;
    else return spotlightSearch[type];
  }
  useEffect(() => {
    loadMicroFrontend(hostUrl, () => {
      window[`mount_${appId}`]({
        elementId,
        path,
        // mainContext: mainCtx,
        getGlobalVariables: getGlobalVariables,
        getsportlightSearch: getsportlightSearch,
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

  return (
    <div className="loadingMicro" id={elementId}>
      <i className="fas fa-cog fa-spin loadingIcon"></i>
      <p className="loadingText">Starting Module...</p>
    </div>
  );
};

export default MicroFrontend;
