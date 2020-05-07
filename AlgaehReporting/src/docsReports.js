import axios from "axios";
import algaehMysql from "algaeh-mysql";
import cheerio from "cheerio";
import path from "path";
import moment from "moment";
import puppeteer from "puppeteer";
import fs from "fs-extra";
import "core-js/stable";
import "regenerator-runtime/runtime";

export function getKPIDetails(req, res, next) {
  const headers = req.headers;
  const { _id, parameters } = req.query;
  let params = {};
  if (parameters !== undefined && parameters !== "") {
    params = JSON.parse(parameters);
  }
  try {
    axios({
      method: "GET",
      params: {
        _id: _id,
      },
      url: "http://localhost:3006/api/v1/Document/getDocumentById",
      headers: {
        "x-api-key": headers["x-api-key"],
        "x-client-ip": headers["x-client-ip"],
        "x-branch": headers["x-branch"],
      },
    })
      .then((resultData) => {
        const { data } = resultData;
        const { result } = data;
        const { kpi_parameters, kpi_query, kpi_type } = result;
        let values = [];
        if (Array.isArray(kpi_parameters)) {
          values = kpi_parameters.map((item) => {
            return params[item];
          });
        }
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query: kpi_query,
            values: values,
            printQuery: true,
          })
          .then((sqlData) => {
            _mysql.releaseConnection();
            req.records = sqlData;
            req.kpi_type = kpi_type;
            next();
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (e) {
    next(e);
  }
}
export function generateReport(req, res, next) {
  const headers = req.headers;
  const { _id } = req.query;
  try {
    axios({
      method: "GET",
      params: {
        kpi_id: _id,
      },
      url: "http://localhost:3006/api/v1/Document/getDocumentMasterById",
      headers: {
        "x-api-key": headers["x-api-key"],
        "x-client-ip": headers["x-client-ip"],
        "x-branch": headers["x-branch"],
      },
    }).then((details) => {
      const { data } = details;
      const { result } = data;
      const html = result.kpi_html;
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
      //   $("[data-table-field]").each((index,table)=>{
      //      $(table).
      //   })

      (async () => {
        const htmlString = $.html();

        const kpitype = req.kpi_type;
        const _path = path.join(
          process.cwd(),
          "algaeh_report_tool/templates/Output",
          `${kpitype}_${moment().format("YYYYMMDDHHmmss")}.pdf`
        );

        const browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--headless",
            "--disable-gpu",
            "--disable-dev-shm-usage",
          ],
        });
        const page = await browser.newPage();

        await page.setContent(htmlString);
        await page.pdf({
          path: _path,
          printBackground: true,
        });
        await browser.close();
        fs.exists(_path, (exists) => {
          if (exists) {
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
    });
  } catch (e) {
    next(e);
  }
}
