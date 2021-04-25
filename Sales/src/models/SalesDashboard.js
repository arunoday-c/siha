import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import newAxios from "algaeh-utilities/axios";
import algaehMail from "algaeh-utilities/mail-send";

export default {
  top10SalesIncomebyItem: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(invoice_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `SELECT IM.item_description,SUM(NB.total_amount) AS total_amount,count(NB.item_id) as item_count, NB.dispatch_quantity
          FROM hims_f_sales_invoice_header H
          INNER JOIN hims_f_sales_invoice_detail D ON H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id
          INNER JOIN hims_f_sales_dispatch_note_header NH ON NH.hims_f_dispatch_note_header_id = D.dispatch_note_header_id
          INNER JOIN hims_f_sales_dispatch_note_detail ND ON ND.dispatch_note_header_id = NH.hims_f_dispatch_note_header_id
          INNER JOIN hims_f_sales_dispatch_note_batches NB ON ND.hims_f_sales_dispatch_note_detail_id = NB.sales_dispatch_note_detail_id
          inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = NB.item_id
          where ${_stringData} AND H.is_cancelled='N'
          GROUP BY NB.item_id order by NB.dispatch_quantity DESC limit 0,10;`,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  top10SalesIncomebyServices: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(SI.invoice_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `
          SELECT S.service_name,SIS.quantity
          FROM hims_f_sales_invoice_header as SI
          inner join hims_f_sales_invoice_services SIS on SIS.sales_invoice_header_id = SI.hims_f_sales_invoice_header_id
          inner join hims_d_services S on S.hims_d_services_id = SIS.services_id
          where SI.sales_invoice_mode='S' and ${_stringData}
          GROUP BY S.hims_d_services_id order by SIS.quantity DESC limit 0,10;
        `,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  top10SalesIncomebyCostCenter: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(IH.invoice_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `
         
select SUM(net_extended_cost) net_extended_cost,
	MAX(IH.project_id) project_id, MAX(project_desc) project_desc
	from hims_f_sales_invoice_header IH
	inner join hims_f_sales_invoice_detail ID on ID.sales_invoice_header_id =  IH.hims_f_sales_invoice_header_id
	inner join hims_f_sales_dispatch_note_detail DD on DD.dispatch_note_header_id = ID.dispatch_note_header_id
	inner join hims_f_sales_dispatch_note_batches DB on DB.sales_dispatch_note_detail_id =  DD.hims_f_sales_dispatch_note_detail_id
	inner join hims_d_project P on P.hims_d_project_id =  IH.project_id
	where is_cancelled='N' and   ${_stringData}
	group by  IH.project_id order by net_extended_cost DESC limit 0,10;
        `,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  salesDashBoardWithAttachment: (req, res, next) => {
    // const _mysql = new algaehMysql();
    const { hospital_address, hospital_name } = req.userIdentity;
    const {
      reportName,
      MailName,
      paramName1,
      paramValue1,
      paramName2,
      paramValue2,
      to_mail_id,
      body_mail,
    } = req.query;

    const mail_body = body_mail ? body_mail : "";
    try {
      const reportInput = [
        {
          report: {
            reportName: reportName,
            reportParams: [
              {
                name: paramName1,
                value: paramValue1,
              },
              {
                name: paramName2 ? paramName2 : "",
                value: paramValue2 ? paramValue2 : "",
              },
            ],
            outputFileType: "PDF",
          },
        },
      ];

      newAxios(req, {
        url: "http://localhost:3006/api/v1//Document/getEmailConfig",
      }).then((res) => {
        const options = res.data;
        const mailSender = new algaehMail(options.data[0])
          .to(to_mail_id)
          .subject(MailName)
          .templateHbs("salesDashBoardMails.hbs", {
            hospital_address,
            hospital_name,
            mail_body,
          });

        mailSender.attachReportsAndSend(req, reportInput, (error, records) => {
          if (error) {
            next(error);
            return;
          }

          next();
        });
      });
    } catch (e) {
      next(e);
    }
  },
};
