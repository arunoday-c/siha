const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const encodeHexaDecimal = options.encodeHexaDecimal;
  const hexToBase64String = options.hexToBase64String;
  const moment = options.moment;
  return new Promise(function (resolve, reject) {
    try {
      const header = options.result[0].length > 0 ? options.result[0] : [{}];
      const detail = options.result[1];
      let otherObj = {};
      const { organization_name, business_registration_number, qr_encrypt } =
        _.head(options.mainData);
      const { invoice_date } = _.head(header);

      let qrString = "";
      if (qr_encrypt === "Y") {
        const sellerName = encodeHexaDecimal("01", organization_name);
        const registrationNo = encodeHexaDecimal(
          "02",
          business_registration_number
        );
        const timeStamp = encodeHexaDecimal(
          "03",
          moment.utc(moment(invoice_date).utc()).format()
        );
        const invoiceWithTax = encodeHexaDecimal(
          "04",
          parseFloat(
            parseFloat(_.sumBy(detail, (s) => parseFloat(s.net_amount))) +
              parseFloat(_.sumBy(detail, (s) => parseFloat(s.company_tax))) +
              parseFloat(_.sumBy(detail, (s) => parseFloat(s.patient_tax)))
          ).toString()
        );
        const vatTotal = encodeHexaDecimal(
          "05",
          parseFloat(
            parseFloat(_.sumBy(detail, (s) => parseFloat(s.company_tax))) +
              parseFloat(_.sumBy(detail, (s) => parseFloat(s.patient_tax)))
          ).toString()
        );
        qrString = hexToBase64String(
          `${sellerName}${registrationNo}${timeStamp}${invoiceWithTax}${vatTotal}`
        );
      } else {
        qrString = `Seller's Name: ${organization_name}
	  Seller's TRN: ${business_registration_number}
	  Invoice Date & Time : ${invoice_date}
	  Invoice Total (With VAT): SAR ${parseFloat(
      parseFloat(_.sumBy(detail, (s) => parseFloat(s.net_amount))) +
        parseFloat(_.sumBy(detail, (s) => parseFloat(s.company_tax))) +
        parseFloat(_.sumBy(detail, (s) => parseFloat(s.patient_tax)))
    ).toString()}
	  VAT Total : SAR ${parseFloat(
      parseFloat(_.sumBy(detail, (s) => parseFloat(s.company_tax))) +
        parseFloat(_.sumBy(detail, (s) => parseFloat(s.patient_tax)))
    ).toString()}`;
      }

      const result = {
        header: { ...header[0], ...options.mainData[0] },
        detail: _.chain(detail)
          .groupBy((g) => g.service_type)
          .map(function (dtl, key) {
            const find = _.find(dtl, (f) => f.service_type === key);
            return {
              service_type: key,
              arabic_service_type: find["arabic_service_type"],
              detailList: dtl,
            };
          })
          .value(),
        total_gross_amount: _.sumBy(detail, (s) => parseFloat(s.gross_amount)),
        total_discount_amount: _.sumBy(detail, (s) =>
          parseFloat(s.discount_amount)
        ),
        total_patient_share: _.sumBy(detail, (s) =>
          parseFloat(s.patient_share)
        ),
        // total_copay_amount: _.sumBy(detail, s => parseFloat(s.company_resp)),
        total_patient_tax: _.sumBy(detail, (s) => parseFloat(s.patient_tax)),
        total_company_resp: _.sumBy(detail, (s) => parseFloat(s.company_resp)),
        total_company_tax: _.sumBy(detail, (s) => parseFloat(s.company_tax)),
        total_net_claim: _.sumBy(detail, (s) => parseFloat(s.patient_payable)),
        qrData: qrString,
      };

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
