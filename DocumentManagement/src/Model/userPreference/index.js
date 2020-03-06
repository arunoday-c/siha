import userPrefernce from "./userPreferencesSchema";
export function setUserPreference(req, res, next) {
  const {
    user_id,
    screenCode,
    language,
    theme,
    controlName,
    controlValue
  } = req.body;
  userPrefernce
    .findOne({
      userID: user_id
    })
    .then(result => {
      let newDetails = { userID: user_id };
      //{userID:1,preferences:[{screenCode:'front_desk',preference:[{controlName:"",controlValue:""}]}]}
      if (result !== null && Object.keys(result).length > 0) {
        let details = result["preferences"];
        const screens = details.find(f => f.screenCode === screenCode);
        const indexS = screens.indexOf(screens);
        if (screens !== undefined) {
          const preference = screens["preference"].find(
            f => f.controlName === controlName
          );
          if (preference !== undefined) {
            const index = screens["preference"].indexOf(preference);
            screens["preference"][index] = {
              controlName: controlName,
              controlValue: controlValue
            };
          } else {
            screens["preference"].push({
              controlName: controlName,
              controlValue: controlValue
            });
          }
          details[indexS] = screens;
        } else {
          details.push({
            screenCode: screenCode,
            preference: [{ controlName, controlValue }]
          });
        }

        newDetails = { ...result, preferences: details };
      } else {
        newDetails["preferences"] = [
          {
            screenCode: screenCode,
            preference: [{ controlName, controlValue }]
          }
        ];
      }
      const _lan = language !== undefined ? { language: language } : {};
      const _theme = theme !== undefined ? { theme: theme } : {};
      newDetails = { ...newDetails, ..._lan, ..._theme };
      console.log("newDetails", JSON.stringify(newDetails));
      userPrefernce
        .findOneAndUpdate({ userID: newDetails.userID }, newDetails, {
          upsert: true,
          new: true
        })
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
