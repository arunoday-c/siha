module.exports = (options, connection) =>
  new Promise(async (resolve, reject) => {
    try {
      const { data } = options;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        const {
          hims_f_request_download_id,
          user_id,
          report_title,
          download_location,
        } = data[i];
        newData.push({
          hims_f_request_download_id,
          primary_user_ids: user_id,
          primary_message: `Requested Ledger Report ${report_title} is ready to <a href='http://localhost:3018/getDownloadLink/${download_location}' target='_blank'>Download</a>.`,
        });
      }
      // console.log("newData=== ", JSON.stringify(newData));
      resolve(newData);
    } catch (e) {
      reject(e);
    }
  });
