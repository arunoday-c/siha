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

export const getAll = (req, res) => {
  const { page, limit, search } = req.query;
  let query = {};
  if (search) {
    let regex = new RegExp(search, "i");
    query.fieldName = regex;
  }

  translationModel
    .paginate(query, { limit, page })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((e) => {
      res.status(400).json({ error: e.message });
    });
};

export const updateTranslation = (req, res) => {
  const { id } = req.params;
  const input = req.body;
  delete input._id;
  delete input.__v;

  translationModel
    .updateOne({ _id: id }, { $set: { ...input } })
    .then((value) => {
      res.status(200).json({ data: value });
    });
};

export const addTranslation = (req, res) => {
  const input = req.body;
  const result = new translationModel({ ...input });
  result.save().then((value) => {
    console.log();
    res.status(200).json({ data: value });
  });
};

export const deleteTranslation = (req, res) => {
  const { id } = req.params;

  translationModel.findByIdAndDelete(id).then((value) => {
    res.status(200).json({ data: value });
  });
};

export const getPath = (req, res) => {
  const keys = Object.keys(translationModel.schema.paths);
  let forDeletion = ["_id", "__v"];
  const data = keys.filter((item) => !forDeletion.includes(item));
  res.status(200).json({ data });
};
