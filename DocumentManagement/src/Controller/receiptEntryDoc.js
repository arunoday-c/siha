import receipt from "../Model/receiptEntryDoc";
import formidable from "formidable";
import fs from "fs";

export const saveReceiptEntryDoc = (req, res) => {
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

export const getReceiptEntryDoc = (req, res) => {
  const { grn_number } = req.query;
  receipt.find({ grn_number }, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};

export const deleteReceiptEntryDoc = (req, res) => {
  const { id } = req.body;
  receipt.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};
