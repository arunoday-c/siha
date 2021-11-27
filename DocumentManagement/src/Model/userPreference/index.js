import userPrefernce from "./userPreferencesSchema";
export function setUserPreference(req, res, next) {
  const {
    user_id,
    screen_code,
    language,
    theme,
    controlName,
    preferenceData,
    controlValue,
  } = req.body;

  userPrefernce
    .findOne({
      userID: user_id,
    })
    .then((result) => {
      let newDetails = { userID: user_id };
      const keysArray = Object.keys(preferenceData);
      if (result !== null) {
        let details = [result._doc[screen_code]];
        let updateArray = [];
        for (let i = 0; i < keysArray.length; i++) {
          updateArray = details.map((item) => {
            if (item[keysArray[i]] === preferenceData[keysArray[i]]) {
              return { ...item };
            } else {
              item[keysArray[i]] = preferenceData[keysArray[i]];
              return item;
            }
          });
        }
        newDetails = {
          userID: user_id,
          language: result.language,
          theme: result.theme,
        };
        newDetails[screen_code] = updateArray[0];
      } else {
        newDetails[screen_code] = preferenceData;
      }

      const _lan = language !== undefined ? { language: language } : {};
      const _theme = theme !== undefined ? { theme: theme } : {};
      newDetails = { ...newDetails, ..._lan, ..._theme };
      userPrefernce
        .findOneAndUpdate({ userID: newDetails.userID }, newDetails, {
          upsert: true,
          new: true,
        })
        .then((response) => {
          res.status(200).json({
            success: true,
            message: "updated success",
          });
        })
        .catch((error) => {
          res.status(400).json({ success: false, message: error });
        });
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: error });
    });
}
export function getUserPreferences(req, res, next) {
  const { user_id } = req.body;
  userPrefernce
    .find({ userID: user_id })
    .then((result) => {
      res.status(200).json({
        success: true,
        records: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error,
      });
    });
}

export async function clearUserPreferences(req, res, next) {
  const { user_id, screen_code } = req.body;

  try {
    const result = await userPrefernce.findOne({ userID: user_id });
    const _doc = result["_doc"];
    delete _doc[screen_code];

    const { preferences, _id, userID, language, theme } = _doc;
    await userPrefernce.findByIdAndUpdate(
      { _id },
      {
        preferences,
        language,
        theme,
        [screen_code]: null,
      }
    );
    res.status(200).json({
      success: true,
      message: "delete success",
    });
  } catch (e) {
    next(e);
  }
}
