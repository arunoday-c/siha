import algaehMysql from "algaeh-mysql";
export default {
    addTermsConditions: (req, res, next) => {
        let inputParam = req.body;
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query:
                        "INSERT INTO `hims_f_terms_condition` (`short_name`, `terms_cond_description`, \
                        `created_by` , `created_date`) VALUES ( ?, ?, ?, ?)",
                    values: [
                        inputParam.short_name,
                        inputParam.terms_cond_description,
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date()
                    ],
                    printQuery: true
                })
                .then(result => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                })
                .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                });
        } catch (e) {
            _mysql.releaseConnection();
            next(e);
        }
    },

    updateTermsConditions: (req, res, next) => {
        let inputParam = req.body;
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query:
                        "UPDATE `hims_f_terms_condition` SET `short_name`=?, `terms_cond_description`=?,  \
                        `terms_cond_status`=?, `updated_by`=?, `updated_date`=? WHERE `hims_f_terms_condition_id`=?",
                    values: [
                        inputParam.short_name,
                        inputParam.terms_cond_description,
                        inputParam.terms_cond_status,
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        inputParam.hims_f_terms_condition_id
                    ],
                    printQuery: true
                })
                .then(result => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                })
                .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                });
        } catch (e) {
            _mysql.releaseConnection();
            next(e);
        }
    },

    getTermsConditions: (req, res, next) => {
        let input = req.query;
        const _mysql = new algaehMysql();

        try {
            let _strAppend = "";
            let inputValues = [];

            if (input.hims_f_terms_condition_id != null) {
                _strAppend += "and hims_f_terms_condition_id=?";
                inputValues.push(input.hims_f_terms_condition_id);
            }
            if (input.terms_cond_status != null) {
                _strAppend += "and terms_cond_status=?";
                inputValues.push(input.terms_cond_status);
            }

            _mysql
                .executeQuery({
                    query:
                        "SELECT * FROM `hims_f_terms_condition` WHERE record_status='A' " +
                        _strAppend +
                        " order by hims_f_terms_condition_id desc",
                    values: inputValues,
                    printQuery: true
                })
                .then(result => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                })
                .catch(error => {
                    _mysql.releaseConnection();
                    next(error);
                });
        } catch (e) {
            _mysql.releaseConnection();
            next(e);
        }
    }
};
