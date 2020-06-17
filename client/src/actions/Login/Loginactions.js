//PatientDetals
import axios from "axios";
import { collectIP, algaehApiCall } from "../../utils/algaehApiCall";
import config from "../../utils/config.json";
import { successfulMessage, encrypter } from "../../utils/GlobalFunctions";
export function getTokenDetals(options) {
  var auth_url = "/api/v1/apiAuth";
  var username = config.apiAuth.user;
  var password = config.apiAuth.password;
  var basicAuth = "Basic " + btoa(username + ":" + password);
  // that.setState({ loading: true });
  options.loading(true);
  // new Promise((resolve, reject) => {
  //   getLocalIP(myIP => {
  //     if (myIP !== undefined) {
  //       resolve(myIP);
  //     }
  //   });
  // })
  collectIP().then((myIP) => {
    const _myRoute = config.routersAndPorts.default;
    const isProxy = window.location.port === "";
    const _localaddress =
      window.location.protocol + "//" + window.location.hostname;
    // const _routingUrl =
    //   _myRoute.url === undefined || _myRoute.url === ""
    //     ? _localaddress
    //     : _myRoute.url;
    const final_url = `${_localaddress}${
      isProxy ? _myRoute.path : `:${_myRoute.port}`
    }${auth_url}`;
    axios({
      method: "GET",
      url: final_url,
      headers: {
        Authorization: basicAuth,
        "x-client-ip": myIP,
      },
    })
      .then((response) => {
        // setItem("token", response.data.token);
        // setToken(response.data.token, response.data.days);
        options.loading(false);
        // sessionStorage.setItem(
        //   "ModuleDetails",
        //   AlgaehCloseContainer(JSON.stringify(response.data.activemoduleList))
        // );
        // options.setHospitals(response.data.hospitalList);
        // that.setState({
        //   hospitalList: response.data.hospitalList,
        //   loading: false
        // });
      })
      .catch((err) => {
        options.loading(true);
        console.error("Error : ", err.message);
        successfulMessage({
          message:
            err.response !== undefined
              ? err.response.data.message
              : err.message,
          title: "Error",
          icon: "error",
        });
      });
  });
}

export function checkUser({ userId }) {
  return new Promise((resolve, reject) => {
    collectIP().then((ip) => {
      algaehApiCall({
        uri: "/apiAuth/userCheck",
        data: { userId: userId },
        notoken: true,
        onSuccess: (response) => {
          resolve(response.data.records);
        },
        onCatch: (error) => {
          reject(error);
        },
      });
    });
  });
}

export function OnSubmitUser({ item_id, username, password }) {
  return new Promise((resolve, reject) => {
    try {
      collectIP().then((identity) => {
        const dataSent = encrypter(
          JSON.stringify({
            username: username,
            password: password,
            item_id: item_id,
            identity: identity,
          })
        );
        algaehApiCall({
          uri: "/apiAuth/authUser",
          data: { post: dataSent },
          notoken: true,
          onSuccess: (response) => {
            const { success, records, message } = response.data;
            if (success === true) {
              resolve(records);
            } else {
              reject(message);
            }
          },
          onCatch: (error) => {
            reject(error);
          },
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
