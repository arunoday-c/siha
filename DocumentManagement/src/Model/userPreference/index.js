import userPrefernce from "./userPreferencesSchema";
export function setUserPreference(req, res, next) {
  const { user_id, detail, language, theme } = req.body;
  userPrefernce
    .findOne({
      userID: user_id
    })
    .then(result => {
      let newDetails = {};

      if (Object.keys(result).length > 0) {
        if (detail !== undefined) {
          const screenDtl = result["screens"].find(
            f => f[detail["code"]] === detail["code"]
          );
          if (screenDtl !== undefined) {
            const index = result["screens"].indexOf(screenDtl);
            result["screens"][index] = { ...screenDtl, ...detail["elements"] };
          }
          newDetails["screens"] = result["screens"];
        }
        if (language !== undefined) {
          newDetails["selectedLanguage"] = language;
        }
        if (theme !== undefined) {
          newDetails["selectedTheme"] = theme;
        }
      } else {
        newDetails["userID"] = user_id;
        newDetails[detail["code"]]=
        if (detail !== undefined) {
          newDetails["screens"] = detail;
        }
        if (language !== undefined) {
          newDetails["selectedLanguage"] = language;
        }
        if (theme !== undefined) {
          newDetails["selectedTheme"] = theme;
        }
      }
      userPrefernce
        .findOneAndUpdate({ userID: user_id }, newDetails)
        .then(response => {
           
          res.status(200).json({
            success: true,
            message: "updated success"
          });
        })
        .catch(error => {
          res.status(400).json({ success: false, message: error });
        });
    })
    .catch(error => {
      res.status(400).json({ success: false, message: error });
    });
}
