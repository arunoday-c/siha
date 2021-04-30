import axios from "axios";
import algaehMysql from "algaeh-mysql";
import cheerio from "cheerio";
import path from "path";
import moment from "moment";
import puppeteer from "puppeteer";
import fs from "fs-extra";
import "core-js/stable";
import "regenerator-runtime/runtime";
import hbs from "handlebars";

export function getKPIDetails(req, res, next) {
  const { kpi_parameter, hims_d_certificate_master_id } = req.query;
  try {
    const _mysql = new algaehMysql();
    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["GEN_CERTIFICATE"],
        table_name: "hims_f_hrpayroll_numgen",
      })
      .then((generatedNumbers) => {
        req.query.certification_number = generatedNumbers.GEN_CERTIFICATE;

        _mysql
          .executeQuery({
            query:
              "SELECT * FROM hims_d_certificate_master CM \
            INNER JOIN hims_d_certificate_type CT ON CT.hims_d_certificate_type_id = CM.certificate_type_id \
            where hims_d_certificate_master_id=?;",
            values: [hims_d_certificate_master_id],
            printQuery: true,
          })
          .then((sqlQuery) => {
            const kpi_query = sqlQuery[0].sql_query + kpi_parameter;
            req.query.kpi_html = sqlQuery[0].certificate_template;
            req.query.kpi_type = sqlQuery[0].certificate_name;
            _mysql
              .executeQuery({
                query: kpi_query,
                printQuery: true,
              })
              .then((sqlData) => {
                _mysql.releaseConnection();
                req.records = sqlData;
                next();
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    next(e);
  }
}
export function generateReport(req, res, next) {
  const { kpi_html, kpi_type } = req.query;
  try {
    const html = kpi_html;
    let $ = cheerio.load(html);
    const mysqlData = req.records;
    const firstRecord = mysqlData[0];

    $("[data-label-field]").each((index, label) => {
      const fieldName = $(label).attr("data-label-field");
      $(label).text(firstRecord[fieldName]);
    });
    $("[data-checkbox-field]").each((index, checkbox) => {
      const fieldName = $(checkbox).attr("data-checkbox-field");
      if (firstRecord[fieldName] === "1") {
        $(checkbox).attr("checked", true);
      }
    });
    (async () => {
      const htmlString = $.html();
      console.log("htmlString", typeof htmlString);
      const kpitype = kpi_type.replace(" ", "_");
      const _path = path.join(
        process.cwd(),
        "algaeh_report_tool/templates/Output",
        `${req.query.certification_number}.pdf`
      );
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const _pdfTemplating = {};

      const header_format = await compile("reportHeader_3", {
        reqHeader: req.headers,
        identity: req.userIdentity,
        user_name: req.userIdentity["username"],
      });
      _pdfTemplating["headerTemplate"] = header_format;

      _pdfTemplating["margin"] = {
        top: "60px",
      };

      _pdfTemplating["footerTemplate"] = await compile("reportFooter_2", {
        reqHeader: req.headers,
      });
      _pdfTemplating["margin"] = {
        ..._pdfTemplating["margin"],
        bottom: "70px",
      };

      const page = await browser.newPage();
      await page.setContent(htmlString);

      await page.pdf({
        path: _path,
        printBackground: true,
        displayHeaderFooter: true,
        ..._pdfTemplating,
      });
      await browser.close();

      fs.exists(_path, async (exists) => {
        if (exists) {
          // const http = require("http");
          // const formidable = require("formidable");

          // const formData = new FormData();
          // formData.append("nameOfTheFolder", kpi_type);
          // formData.append("nameOfTheFolder", "EmployeeCertificate");
          // formData.append(
          //   `file_0`,
          //   _path,
          //   `${kpitype}_${moment().format("YYYYMMDDHHmmss")}.pdf`
          // );
          // formData.append(
          //   "fileName",
          //   `${kpitype}_${moment().format("YYYYMMDDHHmmss")}.pdf`
          // );
          // console.log("formData", formData);

          // const headers = req.headers;
          // await axios
          //   .post("http://localhost:3006/api/v1/uploadDocumentCommon", {
          //     data: formData,
          //     headers: { ...headers, "Content-Type": "multipart/form-data" },
          //   })
          //   .catch((e) => {
          //     console.log("e", e);
          //   });
          // console.log("1111");
          res.writeHead(200, {
            "content-type": "application/pdf",
            "content-disposition": "attachment;filename=" + kpitype,
          });

          const _fs = fs.createReadStream(_path);

          _fs.on("end", () => {
            fs.unlink(_path);
          });
          _fs.pipe(res);
        } else {
          res.status(400).send({ error: "ERROR File does not exist" });
        }
      });
    })();
    // });
  } catch (e) {
    next(e);
  }
}
const compile = async function (templateName, data) {
  try {
    const filePath = path.join(
      process.cwd(),
      "algaeh_report_tool/templates",
      `${templateName}.hbs`
    );
    const html = await fs.readFile(filePath, "utf-8");

    return await hbs.compile(html)(data);
  } catch (error) {
    console.error("Compile Data error,changing to No Records Found : ", error);
    return "<center><b>No Records Found</b></center>";
  }
};
