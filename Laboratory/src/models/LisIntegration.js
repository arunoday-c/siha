import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

let getLisMachineData = (req, res, next) => {
    const _mysql = new algaehMysql({ path: keyPath });
    try {
        let inputObj = req.query
        _mysql
            .executeQuery({
                query: "select * from hims_d_lis_configuration where hims_d_lis_configuration_id = ?;",
                values: [inputObj.hims_d_lis_configuration_id],
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
};

let getTestDetails = (req, res, next) => {
    const _mysql = new algaehMysql({ path: keyPath });
    try {
        let inputObj = req.query
        _mysql
            .executeQuery({
                query: "select LO.*, P.patient_code, P.full_name, P.date_of_birth, P.gender, LS.sample_id, DLS.description\
                from hims_f_lab_order LO inner join hims_f_patient P on P.hims_d_patient_id = LO.patient_id  \
                inner join hims_f_lab_sample LS on LS.order_id = LO.hims_f_lab_order_id  \
                inner join hims_d_lab_specimen DLS on LS.sample_id = DLS.hims_d_lab_specimen_id  \
                where lab_id_number = ?",
                values: [inputObj.lab_id_number],
                printQuery: true
            })
            .then(result => {
                if (inputObj.order_mode === "1") {

                }
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
};

export default {
    getLisMachineData,
    getTestDetails
};
