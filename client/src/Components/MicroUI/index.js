import React, { useEffect, useContext } from "react";
import { MainContext } from "algaeh-react-components";
import loadMicroFrontend from "./MicroFrontendService";
import Config from "../../utils/config.json";
const MicroFrontend = ({ history, host, path }) => {
  const mainCtx = useContext(MainContext);
  const _cnf = Config.routersAndPorts[host];
  const appId = _cnf?.name.replace(/ /g, "");
  const elementId = `micro-container-${appId}`;
  const _portOrLocation = window.location.port ? _cnf?.port : _cnf?.path;
  const hostUrl = window.location.port
    ? `http://${window.location.hostname}:${_portOrLocation}/microBuild/`
    : `/${_portOrLocation}/microBuild/`;
  useEffect(() => {
    loadMicroFrontend(hostUrl, () => {
      window[`mount_${appId}`]({
        history,
        elementId,
        path,
        mainContext: mainCtx,
      });
    });

    return () => {
      window[`unmount_${appId}`]({ elementId });
    };
  }, [history, hostUrl, appId, elementId]);

  return <div id={elementId}>Loading micro...</div>;
};

export default MicroFrontend;
