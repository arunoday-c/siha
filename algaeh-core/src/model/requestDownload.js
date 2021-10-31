import axios from "axios";
export function requestDownload(req, res, next) {
  try {
    const params = req.query;
    let port = "";
    const splitHost = req.headers.host?.split(":");
    if (splitHost?.length === 2) {
      port = ":3018";
    } else {
      port = "/reports";
    }
    const download_link = `${req.protocol}://${req.hostname}${port}`;
    axios({
      url: "http://localhost:3038/api/v1/report/getDownloadRequest",
      params: { ...params, download_link },
      method: "GET",
      headers: {
        "x-api-key": req.headers["x-api-key"],
      },
    })
      .then((response) => {
        res
          .status(200)
          .json({ ...response.data })
          .end();
      })
      .catch((error) => {
        throw error;
      });
  } catch (e) {
    console.log("error====>", e);
    next(e);
  }
}
