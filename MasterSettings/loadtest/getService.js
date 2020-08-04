import http from "k6/http";
import { sleep, check } from "k6";
import { headers, baseURI } from "./header.js";
export let options = {
  vus: 5,
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 10 },
    { duration: "20s", target: 0 },
  ],
};
export default function () {
  const params = {
    headers: headers,
  };

  let res = http.get(`${baseURI}/serviceType/getService`, params);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
