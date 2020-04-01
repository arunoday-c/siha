import puppeteer from "puppeteer";
import moment from "moment";
import hbs from "handlebars";
import path from "path";
import fs from "fs-extra";
import merge from "easy-pdf-merge";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { compile } from "./hbs_compilers";
import { getReportData } from "./load_data_db";
import { convertMilimetersToPixel } from "algaeh-utilities/reportConvetions";
let outputFolder = path.join(
  path.join(process.cwd(), "algaeh_report_tool/templates", "Output")
);
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

export function generatePDFReport(req, res) {
  const { report } = req.query;
  const {
    reportName,
    reportParams,
    pageOrentation,
    pageSize,
    others
  } = JSON.parse(report);
  const { algaeh_d_app_user_id, username } = req.userIdentity;
  const userFolder = path.join(
    process.cwd(),
    "algaeh_report_tool/templates/Output",
    `${username}_${algaeh_d_app_user_id}`
  );
  const reportFolderName = path.join(userFolder, reportName.replace(/\s/g, ""));
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder);
  }

  if (!fs.existsSync(reportFolderName)) {
    fs.mkdirSync(reportFolderName);
  }
  let outpdfPath = path.join(
    reportFolderName,
    `${reportName.replace(/\s/g, "")}.pdf`
  );
  getReportData(req)
    .then(result => {
      const fileName = moment().format("YYYYMMDDHHmmss");
      const {
        data,
        report_footer_file_name,
        report_header_file_name,
        report_name_for_header
      } = result;

      if (Array.isArray(data)) {
        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }
        (async () => {
          let pdfsToMerge = [];
          await asyncForEach(data, async (item, index) => {
            const browser = await puppeteer.launch({
              headless: true,
              args: process.env.CHROME_BIN
                ? [
                    "--no-sandbox",
                    "--headless",
                    "--disable-gpu",
                    "--disable-dev-shm-usage"
                  ]
                : []
            });

            const page = await browser.newPage();
            let pdfTemplating = {};
            if (
              report_header_file_name != null &&
              report_header_file_name != ""
            ) {
              const headers = await compile(report_header_file_name, {
                ...req.userIdentity,
                report_name_for_header: report_name_for_header,
                filter: reportParams == null ? [] : reportParams
              });
              pdfTemplating["headerTemplate"] = headers;
              pdfTemplating["margin"] = {
                top: "150px"
              };
            }
            if (
              report_footer_file_name != null &&
              report_footer_file_name != ""
            ) {
              pdfTemplating["footerTemplate"] = await compile(
                report_footer_file_name,
                {
                  ...req.userIdentity,
                  report_name_for_header: report_name_for_header
                }
              );
              pdfTemplating["margin"] = {
                ...pdfTemplating["margin"],
                bottom: "70px"
              };
            } else {
              pdfTemplating[
                "footerTemplate"
              ] = `<style> .pdffooter { font-size: 8px;
                font-family: Arial, Helvetica, sans-serif; font-weight: bold; width: 100%; text-align: center; color: grey; padding-left: 10px; }
              .showreportname{float:left;padding-left:5px;font-size: 08px;}
              .showcompay{float:right;padding-right:5px;font-size: 08px;}
              </style>
              <div class="pdffooter">
              <span class="showreportname">System Generated Report - ${report_name_for_header}</span>
              <span>Page </span>
              <span class="pageNumber"></span> / <span class="totalPages"></span>
              <span class="showcompay">Powered by Algaeh Techonologies.</span>
            </div>`;
              pdfTemplating["margin"] = {
                ...pdfTemplating["margin"],
                bottom: "50px"
              };
            }
            await page.setContent(
              await compile(reportName, { ...item, ...req.userIdentity })
            );
            let pageOrentation =
              pageOrentation == null
                ? {}
                : pageOrentation == "landscape"
                ? { landscape: true }
                : {};
            let pageSize =
              pageSize == null ? { format: "A4" } : { format: pageSize };
            let displayHeaderFooter = true;
            if (others !== undefined) {
              const existsSize = Object.keys(others).find(
                f => f === "width" || f === "height"
              );

              if (existsSize !== undefined) {
                pageSize = {};
                pdfTemplating = {};
                await page.addStyleTag({
                  content: "@page:first {margin-top: -8px;}"
                });
                const sizes = convertMilimetersToPixel(others);

                await page.setViewport({
                  width: Math.ceil(sizes.width),
                  height: Math.ceil(sizes.height)
                });
              }
              displayHeaderFooter =
                others.showHeaderFooter === false ? false : true;
            }
            const pdfPath = path.join(
              reportFolderName,
              `${fileName}_${index}.pdf`
            );

            await page.pdf({
              path: pdfPath,
              ...pageSize,
              ...pageOrentation,
              printBackground: true,
              displayHeaderFooter: displayHeaderFooter,
              ...pdfTemplating,
              ...others
            });
            await browser.close();
            pdfsToMerge.push(pdfPath);
          });
          if (pdfsToMerge.length > 0) {
            merge(pdfsToMerge, outpdfPath, error => {
              if (error !== null) {
                res.status(400).send({ error: JSON.stringify(error) });
              } else {
                res.writeHead(200, {
                  "content-type": "application/pdf",
                  "content-disposition": "attachment;filename=" + outpdfPath
                });

                if (fs.existsSync(outpdfPath)) {
                  const _fs = fs.createReadStream(outpdfPath);

                  _fs.on("end", () => {
                    fs.unlink(outpdfPath);
                    for (let f = 0; f < pdfsToMerge.length; f++) {
                      fs.unlink(pdfsToMerge[f]);
                    }
                  });
                  _fs.pipe(res);
                } else {
                  res
                    .status(400)
                    .send({ error: new Error("No file is generated") });
                  console.log("Not exists");
                }
              }
            });
          } else {
            outpdfPath = pdfsToMerge[0];
            res.writeHead(200, {
              "content-type": "application/pdf",
              "content-disposition": "attachment;filename=" + outpdfPath
            });
            const _fs = fs.createReadStream(outpdfPath);
            _fs.on("end", () => {
              fs.unlink(outpdfPath);
            });
            _fs.pipe(res);
          }
        })();
      }
    })
    .catch(error => {
      console.log(error);
    });
}
