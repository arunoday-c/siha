import invoice from "../Model/invoiceDoc";
import formidable from "formidable";
import fs from "fs";

export const saveInvoiceDoc = (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      console.log(err.message, "msg");
      res.status(400).json({ error: err.message });
    }
    for (const [name, file] of Object.entries(files)) {
      fs.promises.readFile(file.path, { encoding: "base64" }).then((docStr) => {
        const saveDoc = new invoice({
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

export const getInvoiceDoc = (req, res) => {
  const { serial_no } = req.query;
  invoice.find({ serial_no }, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};

export const deleteInvoiceDoc = (req, res) => {
  const { id } = req.body;
  invoice.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};

//
// console.log(documents, "docs");
// const saveArr = documents.map((doc) => new invoice(doc));
// Promise.all(saveArr.map((doc) => doc.save()))
//   .then((done) => {
//     res.status(200).json({ success: true, data: done });
//   })
//   .catch((e) => {
//     res.status(400).json({ error: e.message });
//     console.error(e.message);
//   });

// Promise.all(
//   Object.entries(files).map(([name, file]) =>
//     fs.promises.readFile(file.path, { encoding: "base64" })
//   )
// )
//   .then((docStrs) =>
//     Promise.all(
//       docStrs.map((docStr) => {
//         const saveDoc = new invoice({
//           ...fields,
//           filename: file.name,
//           filetype: file.type,
//           document: docStr,
//         });
//         console.log(file);
//         console.log(saveDoc, "to svae");
//         return saveDoc.save();
//       })
//     )
//   )
//   .then((docs) => res.status(400).json({ success: true, data: docs }))
//   .catch((e) => {
//     res.status(400).json({ error: e.message });
//     console.error(e.message);
//   });
