"use strict";

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _logging = require("../utils/logging");

var _keys = require("../keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translate = new _awsSdk2.default.Translate(_keys2.default.AWSCredentials);

var getTargetLangage = function getTargetLangage(req, res, next) {
  (0, _logging.debugFunction)("getTargetLangage");

  var languageModel = {
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
  languageModel = JSON.parse(_fs2.default.readFileSync(_keys2.default.languageFolderPath + "/language.json"));

  var targetLanguage = languageModel.targetLanguage;
  var sourceLanguage = languageModel.sourceLanguage;
  var isForceChange = languageModel.forceChange;
  var itemLength = Object.keys(languageModel).length;
  Object.keys(languageModel).forEach(function (key, index) {
    Object.keys(languageModel[key]).forEach(function (k) {
      if (k == "target") {
        if (isForceChange) {
          translateApi(sourceLanguage, targetLanguage, languageModel[key]["english"], key, index, function (data, key, index) {
            languageModel[key]["target"] = data["TranslatedText"];
            (0, _logging.debugLog)("translated", languageModel[key]);
            if (index == itemLength - 1) {
              _fs2.default.writeFileSync(_keys2.default.languageFolderPath + "/language.json", JSON.stringify(languageModel));
              next();
            }
          });
        } else {
          if (languageModel[key]["target"] == null || languageModel[key]["target"] == "") {
            translateApi(sourceLanguage, targetLanguage, languageModel[key]["english"], key, index, function (data, key, index) {
              languageModel[key]["target"] = data["TranslatedText"];
              (0, _logging.debugLog)("translated", languageModel[key]);
              if (index == itemLength - 1) {
                // req.records = languageModel;
                _fs2.default.writeFileSync(_keys2.default.languageFolderPath + "/language.json", JSON.stringify(languageModel));
                next();
              }
            });
          }
        }
      }
    });
  });
};

var translateApi = function translateApi(source, target, text, key, index, callBack) {
  translate.translateText({
    SourceLanguageCode: source,
    TargetLanguageCode: target,
    Text: text
  }, function (error, data) {
    if (error) {
      _logging.logger.log("error", "Error in Translate : %j", error);
    }
    callBack(data, key, index);
  });
};
module.exports = {
  getTargetLangage: getTargetLangage
};
//# sourceMappingURL=languageTranslator.js.map