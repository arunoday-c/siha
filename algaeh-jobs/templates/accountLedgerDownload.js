module.exports = (options, connection) =>
  new Promise(async (resolve, reject) => {
    try {
      const { data } = options;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        const {
          hims_f_request_download_id,
          employee_id,
          report_title,
          download_link,
          download_location,
        } = data[i];
        newData.push({
          hims_f_request_download_id,
          primary_user_ids: employee_id,
          primary_message: `Requested Ledger Report ${report_title} is ready to <a href='${download_link}/getDownloadLink/${Buffer.from(
            download_location,
            "binary"
          ).toString("base64")}' target='_blank'>Download</a>.`,
        });
      }
      // http://localhost:3018/getDownloadLink/
      // bota(report_location)
      // console.log("newData=== ", JSON.stringify(newData));
      resolve(newData);
    } catch (e) {
      reject(e);
    }
  });
