import receipt from "../Model/radiologyDoc";
import formidable from "formidable";
import fs from "fs";

export const saveRdiologyDoc = (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      console.log(err.message, "msg");
      res.status(400).json({ error: err.message });
    }
    for (const [name, file] of Object.entries(files)) {
      fs.promises.readFile(file.path, { encoding: "base64" }).then((docStr) => {
        const saveDoc = new receipt({
          ...fields,
          filename: file.name,
          filetype: file.type,
          document: docStr,
        });
        saveDoc.save().then((doc) => res.status(200).json({ success: true }));
      });
    }
  });
};

export const getRadiologyDoc = (req, res) => {
  const { hims_f_rad_order_id } = req.query;
  receipt.find({ hims_f_rad_order_id }, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};

export const deleteRadiologyDoc = (req, res) => {
  const { id } = req.body;
  receipt.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};
