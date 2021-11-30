const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const encodeHexaDecimal = options.encodeHexaDecimal;
  const hexToBase64String = options.hexToBase64String;
  const moment = options.moment;

  return new Promise(function (resolve, reject) {
    try {
      // const _ = options.loadash;
      // const moment = options.moment;

      let input = {};
      const params = options.args.reportParams;
      // const hospital_id = options.args.crypto.hospital_id;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      const { qr_encrypt } = _.head(options.mainData);

      options.mysql
        .executeQuery({
          query: `select H.*, D.*,S.service_name, S.arabic_service_name, SO.sales_order_number, 
          CASE WHEN D.service_frequency='M' THEN 'Monthly' WHEN D.service_frequency='W'  THEN 'Weekly' 
          WHEN D.service_frequency='D' THEN 'Daily'  WHEN D.service_frequency='H' THEN 'Hourly' END as service_frequency,  
          SO.customer_po_no, C.customer_name, C.bank_account_no, C.bank_name,  C.address, C.arabic_customer_name, 
          C.vat_number, ROUND(D.tax_percentage, 0) as tax_percentage, D.quantity , 
          HO.hospital_name, CASE WHEN H.is_posted='N' THEN 'Invoice Not Finalized' ELSE '' END as invoice_status 
          from hims_f_sales_invoice_header H   
          inner join hims_f_sales_invoice_services D on H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id   
          inner join hims_d_services S on S.hims_d_services_id = D.services_id   
          inner join hims_d_customer C on C.hims_d_customer_id = H.customer_id   
          inner join hims_d_hospital HO on HO.hims_d_hospital_id = H.hospital_id   
          left join hims_f_sales_order SO on SO.hims_f_sales_order_id=H.sales_order_id where invoice_number=?;
          select organization_name,tax_number,business_registration_number from hims_d_organization;`,
          values: [input.invoice_number],
          printQuery: true,
        })
        .then((result) => {
          const grn_details = result[0];
          // const delv_subDetails = result[1];
          const header = result[1][0];
          let qrString = "";

          if (qr_encrypt === "Y") {
            const detailRst = _.head(grn_details);
            const sellerName = encodeHexaDecimal(
              "01",
              header.organization_name
            );

            const registrationNo = encodeHexaDecimal("02", header.tax_number);
            const timeStamp = encodeHexaDecimal(
              "03",
              moment.utc(moment(detailRst.invoice_date).utc()).format()
            );
            const invoiceWithTax = encodeHexaDecimal(
              "04",
              detailRst.net_payable
            );
            const vatTotal = encodeHexaDecimal("05", detailRst.total_tax);
            qrString = hexToBase64String(
              `${sellerName}${registrationNo}${timeStamp}${invoiceWithTax}${vatTotal}`
            );
          } else {
            qrString = `Seller's Name: ${header.organization_name}
          Seller's TRN: ${header.tax_number}
          Invoice Date & Time : ${header.invoice_date}
          Invoice Total (With VAT): SAR ${header.net_total}
          VAT Total : SAR ${header.total_tax}`;
          }

          console.log("grn_details=", grn_details);
          resolve({
            ...grn_details[0],
            organization_name: header.organization_name,

            net_payable: parseFloat(grn_details[0].net_payable),
            retention_amt: parseFloat(grn_details[0].retention_amt),
            outstanding_balance: parseFloat(
              grn_details[0].net_payable - grn_details[0].retention_amt
            ),
            amount_before_vat: _.sumBy(grn_details, (s) =>
              parseFloat(s.net_extended_cost)
            ),
            netdiscount_amount: parseFloat(grn_details[0].discount_amount),
            total_tax: parseFloat(grn_details[0].total_tax),

            // hospital_name: result[0]["hospital_name"],
            // invoice_number: result[0]["invoice_number"],
            // bank_name: result[0]["bank_name"],
            // bank_account_no: result[0]["bank_account_no"],
            // narration: result[0]["narration"],
            // invoice_date: moment(result[0]["invoice_date"]).format(
            //   "DD-MM-YYYY"
            // ),
            // customer_name: result[0]["customer_name"],
            // customer_po_no: result[0]["customer_po_no"],
            // arabic_customer_name: result[0]["arabic_customer_name"],
            // vat_number: result[0]["vat_number"],
            // address: result[0]["address"],
            // invoice_status: result[0]["invoice_status"],
            // amount_before_vat: options.currencyFormat(
            //   _.sumBy(result, (s) => parseFloat(s.net_extended_cost)),
            //   options.args.crypto
            // ),
            // netdiscount_amount: options.currencyFormat(
            //   parseFloat(result[0]["discount_amount"]),
            //   options.args.crypto
            // ),
            // total_tax: options.currencyFormat(
            //   parseFloat(result[0]["total_tax"]),
            //   options.args.crypto
            // ),

            detailList: grn_details,
            qrData: qrString,
            invoice_date: moment(grn_details[0].invoice_date).format(
              "DD-MM-YYYY"
            ),
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyheader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
