import inventoryItemMasterModal from "../Model/inventoryItemMasterImages";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const folder = process.env.UPLOADFOLDER || process.cwd();
export const uploadInvItemImg = (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      console.log(err.message, "msg");
      res.status(400).json({ error: err.message });
    }

    inventoryItemMasterModal
      .insertMany(docs)
      .then((docs) => res.status(200).json({ success: true }));
  });
};

// export const getSubDeptImage = (req, res) => {
//   const { contract_no } = req.query;
//   inventoryItemMasterModal.find({ contract_no }, (err, docs) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else {
//       res.status(200).json({ success: true, data: docs });
//     }
//   });
// };

export const deleteInvItemImg = (req, res) => {
  const { id } = req.body;
  inventoryItemMasterModal.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(200).json({ success: true, data: docs });
    }
  });
};
