import subdeptImages from "../Model/subDeptImages";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const folder = process.env.UPLOADFOLDER || process.cwd();
export const saveSubDeptImage = (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      console.log(err.message, "msg");
      res.status(400).json({ error: err.message });
    }

    subdeptImages
      .insertMany(docs)
      .then((docs) => res.status(200).json({ success: true }));
  });
};

export const getSubDeptImage = (req, res) => {
  const { contract_no } = req.query;
  subdeptImages.find({ contract_no }, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};

export const deleteSubDeptImage = (req, res) => {
  const { id } = req.body;
  subdeptImages.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      if (docs.fromPath === true) {
        const uploadExists = folder.toUpperCase().includes("UPLOAD");
        const uploadPath = path.resolve(folder, uploadExists ? "" : "UPLOAD");
        fs.unlinkSync(path.resolve(uploadPath, docs.filename));
      }
      res.status(200).json({ success: true, data: docs });
    }
  });
};

//
// console.log(documents, "docs");
// const saveArr = documents.map((doc) => new contract(doc));
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
//         const saveDoc = new contract({
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
