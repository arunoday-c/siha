import AWS from "aws-sdk";
import logUtils from "../utils/logging";
import algaehKeys from "algaeh-keys"; //"../keys/keys";
const keys = algaehKeys.default;
import fs from "fs";
let translate = new AWS.Translate(keys.AWSCredentials);

const { logger, debugFunction, debugLog } = logUtils;

let getTargetLangage = (req, res, next) => {
  debugFunction("getTargetLangage");

  let languageModel = {
    targetLanguage: "ar",
    sourceLanguage: "en",
    forceChange: false
    /*
      fieldIdentifier:{
        english:'',
        target:null
  
      }
    */
  };

  // extend(languageModel, req.body);
  languageModel = JSON.parse(
    fs.readFileSync(keys.languageFolderPath + "/language.json")
  );

  let targetLanguage = languageModel.targetLanguage;
  let sourceLanguage = languageModel.sourceLanguage;
  let isForceChange = languageModel.forceChange;
  let itemLength = Object.keys(languageModel).length;
  Object.keys(languageModel).forEach((key, index) => {
    Object.keys(languageModel[key]).forEach(k => {
      if (k == "target") {
        if (isForceChange) {
          translateApi(
            sourceLanguage,
            targetLanguage,
            languageModel[key]["english"],
            key,
            index,
            (data, key, index) => {
              languageModel[key]["target"] = data["TranslatedText"];
              debugLog("translated", languageModel[key]);
              if (index == itemLength - 1) {
                fs.writeFileSync(
                  keys.languageFolderPath + "/language.json",
                  JSON.stringify(languageModel)
                );
                next();
              }
            }
          );
        } else {
          if (
            languageModel[key]["target"] == null ||
            languageModel[key]["target"] == ""
          ) {
            translateApi(
              sourceLanguage,
              targetLanguage,
              languageModel[key]["english"],
              key,
              index,
              (data, key, index) => {
                languageModel[key]["target"] = data["TranslatedText"];
                debugLog("translated", languageModel[key]);
                if (index == itemLength - 1) {
                  // req.records = languageModel;
                  fs.writeFileSync(
                    keys.languageFolderPath + "/language.json",
                    JSON.stringify(languageModel)
                  );
                  next();
                }
              }
            );
          }
        }
      }
    });
  });
};

let translateApi = (source, target, text, key, index, callBack) => {
  translate.translateText(
    {
      SourceLanguageCode: source,
      TargetLanguageCode: target,
      Text: text
    },
    (error, data) => {
      if (error) {
        logger.log("error", "Error in Translate : %j", error);
      }
      callBack(data, key, index);
    }
  );
};
export default {
  getTargetLangage
};
