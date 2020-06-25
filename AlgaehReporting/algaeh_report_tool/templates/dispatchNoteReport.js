const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {

      const header = options.result[0][0];
      const details = options.result[1];
      // const subDetails = options.result[2];
      // const outputArray = [];
      // details.forEach(item => {
      //   const batches = subDetails.filter(sub => {
      //     // console.log("sub", sub)
      //     // console.log("item", item)
      //     return (
      //       sub["sales_dispatch_note_detail_id"] ==
      //       item["hims_f_sales_dispatch_note_detail_id"]
      //     );
      //   });

      //   outputArray.push({ ...item, batches });
      // });
      resolve({ ...header, details: details });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
