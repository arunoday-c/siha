import translationModel from "../Model/translation";

export const getTranslation = (req, res) => {
  console.log(req.params);
  res.status(200).json({ data: "Working" });
};
