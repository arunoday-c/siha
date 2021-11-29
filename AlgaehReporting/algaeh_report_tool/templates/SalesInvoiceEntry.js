// const algaehUtilities = require("algaeh-utilities/utilities");
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
          query: `select  H.*, C.customer_name, C.bank_account_no, C.bank_name, C.arabic_customer_name,C.vat_number,C.address, 
          SO.sales_order_number, SO.customer_po_no, SO.sales_order_date, HO.hospital_name, 
          CASE WHEN H.is_posted='N' THEN 'Invoice Not Finalized' ELSE '' END as invoice_status
          from  hims_f_sales_invoice_header H 
          inner join hims_d_customer C on H.customer_id = C.hims_d_customer_id
          left join hims_f_sales_order SO on H.sales_order_id = SO.hims_f_sales_order_id
          inner join hims_d_hospital HO on H.hospital_id = HO.hims_d_hospital_id
          where H.invoice_number=?;                    
          select B.*,SUM(round(dispatch_quantity, 0)) as dispatch_quantity, SUM(total_amount) as total_amount, 
          IM.item_code,IM.item_description, IM.arabic_item_description, ROUND(B.tax_percentage, 0) as tax_percentage from
          hims_f_sales_invoice_header IH 
          inner join  hims_f_sales_invoice_detail ID on IH.hims_f_sales_invoice_header_id=ID.sales_invoice_header_id  
          inner join hims_f_sales_dispatch_note_header H  on ID.dispatch_note_header_id=H.hims_f_dispatch_note_header_id 
          inner join hims_f_sales_dispatch_note_detail D on H.hims_f_dispatch_note_header_id= D. dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_batches B on D.hims_f_sales_dispatch_note_detail_id=B.sales_dispatch_note_detail_id
          inner  join hims_d_inventory_item_master IM on B.item_id=IM.hims_d_inventory_item_master_id
          where IH.invoice_number=?  group by item_id order by IM.item_description asc;
          select organization_name,tax_number,business_registration_number from hims_d_organization;`,
          values: [
            input.invoice_number,
            input.invoice_number,
            input.invoice_number,
            input.invoice_number,
          ],
          printQuery: true,
        })
        .then((result) => {
          const grn_details = result[0];
          const delv_subDetails = result[1];
          const header = result[2][0];
          let qrString = "";

          console.log(qr_encrypt);
          // console.log("header=", header);

          if (qr_encrypt === "Y") {
            console.log("1", header);
            const detailRst = _.head(grn_details);

            console.log(detailRst);
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
            console.log("qrString", qrString);
          } else {
            qrString = `Seller's Name: ${header.organization_name}
          Seller's TRN: ${header.tax_number}
          Invoice Date & Time : ${header.invoice_date}
          Invoice Total (With VAT): SAR ${header.net_total}
          VAT Total : SAR ${header.total_tax}`;
            console.log("qrString", qrString);
          }

          console.log("qrString", qrString);
          resolve({
            ...grn_details[0],
            organization_name: header.organization_name,
            invoice_date: moment(grn_details[0].invoice_date).format(
              "YYYY-MM-DD"
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
            // invoice_number: outputArray[0].invoice_number,
            // sales_order_date: outputArray[0].sales_order_date,
            // location_description: outputArray[0].location_description,
            // customer_name: outputArray[0].customer_name,
            // vat_number: outputArray[0].vat_number,
            // arabic_customer_name: outputArray[0].arabic_customer_name,
            // sales_order_number: outputArray[0].sales_order_number,
            // customer_po_no: outputArray[0].customer_po_no,
            // address: outputArray[0].address,
            details: delv_subDetails,
            qrData: qrString,
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
