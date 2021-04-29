import mongoose from "mongoose";
import moment from "moment";
const documentSchema = new mongoose.Schema(
  {
    kpi_type: String,
    kpi_name: String,
    kpi_query: String,
    kpi_parameters: Array,
    kpi_status: String,
  },
  { autoCreate: true }
);
const documentModel = mongoose.model("algaeh_document_kpi", documentSchema);
const documentMaster = new mongoose.Schema(
  {
    kpi_id: String,
    kpi_html: String,
  },
  { autoCreate: true }
);
const documentMasterModel = mongoose.model(
  "algaeh_kpi_document_master",
  documentMaster
);
const certificateIssuedSchema = mongoose.Schema(
  {
    employee_id: Number,
    employee_name: String,
    requested_for: String,
    request_date: String,
    kpi_id: String,
  },
  { autoCreate: true }
);
const certificateIssuedModel = mongoose.model(
  "algaeh_certificate_requests",
  certificateIssuedSchema
);
export default (db) => {
  return {
    saveDocumentKPI: (req, res) => {
      const {
        kpi_type,
        kpi_query,
        kpi_status,
        kpi_name,
        kpi_parameters,
      } = req.body;

      try {
        documentModel
          .findOneAndUpdate(
            {
              kpi_type: kpi_type,
            },
            {
              kpi_type: kpi_type,
              kpi_name: kpi_name,
              kpi_query: kpi_query,
              kpi_parameters: kpi_parameters,
              kpi_status: kpi_status,
            },
            {
              new: true,
              upsert: true,
            }
          )
          .then((result) => {
            res
              .status(200)
              .json({
                succss: true,
              })
              .end();
          })
          .catch((error) => {
            res
              .status(400)
              .json({
                success: false,
                message: error.message,
              })
              .end();
          });
      } catch (error) {
        res
          .status(400)
          .json({
            success: false,
            message: error.message,
          })
          .end();
      }
    },
    getDocumentKPI: (req, res) => {
      documentModel
        .find((f) => f.kpi_status === "A")
        .select("_id kpi_type kpi_name kpi_query kpi_parameters")
        .then((result) => {
          const records = result.map((row) => {
            const { kpi_query, _id, kpi_type, kpi_name, kpi_parameters } = row;
            if (kpi_query) {
              const qry = kpi_query.toLowerCase().split("from")[0];
              const columns = qry
                .split("select")[1]
                .split(",")
                .map((column) => {
                  let col = column.trim();
                  if (column.includes(" as ") === true) {
                    col = column.split(" as ")[1].trim();
                  }
                  return col;
                });

              return {
                _id,
                kpi_type,
                kpi_name,
                columns,
                kpi_parameters,
                kpi_query,
              };
            }
          });

          console.log(records);
          res.status(200).json({ success: true, result: records });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    },
    saveDocumentMaster: (req, res) => {
      const { kpi_id, kpi_html } = req.body;
      documentMasterModel
        .findOneAndUpdate(
          { kpi_id },
          { kpi_id, kpi_html },
          {
            new: true,
            upsert: true,
          }
        )
        .then((result) => {
          res
            .status(200)
            .json({
              success: true,
            })
            .end();
        })
        .catch((error) => {
          res
            .status(400)
            .json({
              success: false,
              message: error,
            })
            .end();
        });
    },
    getDocumentById: (req, res) => {
      const { _id } = req.query;
      documentModel
        .findOne({ _id })
        .select("_id kpi_type kpi_name kpi_query kpi_parameters")
        .then((result) => {
          res.status(200).json({ success: true, result });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    },
    getDocumentMasterById: (req, res) => {
      const { kpi_id } = req.query;
      documentMasterModel
        .findOne({ kpi_id })
        .select("kpi_html")
        .then((result) => {
          res.status(200).json({ success: true, result });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error,
          });
        });
    },
    getCertificateIssuedList: (req, res) => {
      certificateIssuedModel
        .find({})
        .select(
          "_id employee_id request_date employee_name requested_for kpi_id"
        )
        .then((result) => {
          res.status(200).json({ success: true, result });
        })
        .catch((error) => {
          res.status(400).json({
            success: false,
            message: error.message,
          });
        });
    },
    saveCertificateIssued: (req, res) => {
      const { employee_id, employee_name, requested_for, kpi_id } = req.body;
      try {
        const date = moment().format("YYYYMMDD");

        certificateIssuedModel
          .findOneAndUpdate(
            {
              employee_id,
              kpi_id,
              request_date: date,
            },
            {
              request_date: date,
              employee_id,
              employee_name,
              requested_for,
              kpi_id,
            },
            {
              new: true,
              upsert: true,
            }
          )
          .then((result) => {
            res
              .status(200)
              .json({
                success: true,
              })
              .catch((error) => {
                req.status(400).json({
                  success: false,
                  message: error.message,
                });
              });
          });
      } catch (e) {
        res.status(400).json({
          success: false,
          message: e.message,
        });
      }
    },
  };
};
