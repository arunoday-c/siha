import translationModel from "../Model/translation";

export const getTranslation = (req, res) => {
  const { lang } = req.params;
  translationModel.find({}).then((docs) => {
    const data = {};
    docs.forEach((item) => {
      data[item.fieldName] = item[lang];
    });
    res.status(200).json({ ...data });
  });
};
