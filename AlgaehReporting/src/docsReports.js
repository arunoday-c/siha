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
    const _mysql = req.mysql ?? new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "SELECT * FROM hims_d_certificate_master CM \
            INNER JOIN hims_d_certificate_type CT ON CT.hims_d_certificate_type_id = CM.certificate_type_id \
            where hims_d_certificate_master_id=?;",
        values: [hims_d_certificate_master_id],
        printQuery: true,
      })
      .then((certificate_data) => {
        const kpi_query = certificate_data[0].sql_query + ` ${kpi_parameter}`;
        req.query.kpi_html =
          certificate_data[0].certificate_style +
          certificate_data[0].certificate_template +
          `</div></body>`;
        req.query.kpi_type = certificate_data[0].certificate_name;
        req.query.certificate_data = certificate_data[0];
        _mysql
          .executeQuery({
            query: kpi_query,
            printQuery: true,
          })
          .then((sqlData) => {
            // _mysql.releaseConnection();
            _mysql.commitTransaction((error, resu) => {
              if (error) {
                _mysql.rollBackTransaction();
                //error-------
              } else {
                _mysql.releaseConnection();
                req.records = sqlData;
                next();
              }
            });
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
  } catch (e) {
    next(e);
  }
}
export function generateReport(req, res, next) {
  const { kpi_html, kpi_type, certificate_data } = req.query;
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
      const baseObj = {
        header: {
          top: "150px",
          bottom: " ",
          right: " ",
          left: " ",
        },
        footer: {
          top: " ",
          bottom: "100px",
          right: " ",
          left: " ",
        },
        pageOrientation: "",
      };
      const styleObj = certificate_data.report_props
        ? JSON.parse(certificate_data.report_props)
        : baseObj;

      const htmlString = $.html();

      const kpitype = kpi_type?.replace(" ", "_");
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
      if (certificate_data.report_header_file_name) {
        const header_format = await compile(
          certificate_data.report_header_file_name,
          {
            reqHeader: req.headers,
            identity: req.userIdentity,
            user_name: req.userIdentity["username"],
          }
        );
        _pdfTemplating["headerTemplate"] = header_format;
      }

      _pdfTemplating["margin"] = {
        top: styleObj.header.top,
      };
      if (certificate_data.report_footer_file_name) {
        _pdfTemplating["footerTemplate"] = await compile(
          certificate_data.report_footer_file_name,
          {
            reqHeader: req.headers,
          }
        );
      }

      _pdfTemplating["margin"] = {
        ..._pdfTemplating["margin"],
        bottom: styleObj.footer.bottom,
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

      //  fs.exists(_path, async (exists) => {

      const exists = fs.existsSync(_path);
      if (exists) {
        const extension = path.extname(_path);

        const headers = req.headers;
        await axios
          .get(
            `http://localhost:3006/api/v1/uploadFromFilePath?selectedFilePath=${_path}&doc_number=${req.query.certification_number}&nameOfTheFolder=${kpi_type}&fileExtension=${extension}&fileName=${req.query.certification_number}${extension}`,
            {
              // params: {
              //   selectedFilePath: _path,
              //   doc_number: req.query.certification_number,
              //   nameOfTheFolder: kpi_type,
              //   fileExtension: extension,
              //   fileName: `${req.query.certification_number}${extension}`,
              // },
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-client-ip": headers["x-client-ip"],
                // "Content-Type": "multipart/form-data",
              },
            }
          )
          // .then((r) => {
          //
          //   console.log("r======>", r);
          //   // res.status(200).json({ success: true, message: "File " });
          //   // next();
          // })
          .catch((e) => {
            console.error("error in certificate======>", e);
            //res.status(400).json({ success: false, message: e });
          });
        res.status(201).json({
          success: true,
          message: "File is process inform you after it done.",
        });
      } else {
        res.status(400).send({ error: "ERROR File does not exist" });
      }
      //  });
    })();
  } catch (e) {
    next(e);
  }
}
export function saveEmployeeDetails(req, res, next) {
  const { kpi_parameter, hims_d_certificate_master_id, rowData } = req.query;
  const row = JSON.parse(rowData);

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
        req.query.kpi_parameter = kpi_parameter;
        req.query.hims_d_certificate_master_id = hims_d_certificate_master_id;

        if (row.hims_f_certificate_list_id) {
          _mysql
            .executeQuery({
              query: `update hims_f_certificate_list set status='G',issued_by=?,issued_date=?, certification_number=? where hims_f_certificate_list_id=? `,
              values: [
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                generatedNumbers.GEN_CERTIFICATE,
                row.hims_f_certificate_list_id,
              ],
              printQuery: true,
            })
            .then((result) => {
              // _mysql.releaseConnection();
              req.mysql = _mysql;
              req.records = result;
              next();
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          _mysql
            .executeQuery({
              query: `insert into hims_f_certificate_list (employee_id, certificate_id, cer_req_date, status,issued_by,issued_date, certification_number)
              VALUE(?,?,?,?,?,?,?)`,
              values: [
                row.employee_id,
                row.certificate_id,
                new Date(),
                "G",
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                generatedNumbers.GEN_CERTIFICATE,
              ],
              printQuery: true,
            })
            .then((result) => {
              // _mysql.releaseConnection();
              req.records = result;
              req.mysql = _mysql;
              next();
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        }
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
