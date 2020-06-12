import algaehMysql from "algaeh-mysql";

export default {
    getLisMachineData: (req, res, next) => {
        const _mysql = new algaehMysql();

        try {
            let inputObj = req.query;
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
    },

    getTestDetails: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            let inputObj = req.query
            _mysql
                .executeQuery({
                    query: "select LO.hims_f_lab_order_id, LO.ordered_services_id,LO.patient_id,LO.visit_id, \
                    LO.provider_id,LO.service_id,LO.status,LO.billed,LO.cancelled, \
                    date_format(LO.ordered_date,'%Y%m%d') as ordered_date, LO.test_type, LO.lab_id_number, LO.run_type, \
                    date_format(LO.confirmed_date,'%Y%m%d') as confirmed_date, P.patient_code, P.full_name,  \
                    SUBSTRING_INDEX(SUBSTRING_INDEX(full_name, ' ', 1), ' ', -1) AS  first_name, \
                    If(  length(full_name) - length(replace(full_name, ' ', ''))>1,   \
                    SUBSTRING_INDEX(SUBSTRING_INDEX(full_name, ' ', 2), ' ', -1) ,NULL) as middle_name, \
                    SUBSTRING_INDEX(SUBSTRING_INDEX(full_name, ' ', -1), ' ', -1) AS last_name, \
                    date_format(P.date_of_birth,'%Y%m%d') as date_of_birth, \
                    CASE P.gender WHEN 'Male' THEN 'M' WHEN 'Female' THEN 'F' else 'U' END as gender, LS.sample_id, \
                    DLS.description, IT.test_code from hims_f_lab_order LO \
                    inner join hims_f_patient P on P.hims_d_patient_id = LO.patient_id \
                    inner join hims_d_investigation_test IT on IT.services_id = LO.service_id \
                    inner join hims_f_lab_sample LS on LS.order_id = LO.hims_f_lab_order_id \
                    inner join hims_d_lab_specimen DLS on LS.sample_id = DLS.hims_d_lab_specimen_id \
                    where lab_id_number = ?;",
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
    },

    //created by: Irfan to compare lab results
    getComparedLabResult: (req, res, next) => {
        try {
            if (req.query.pre_order_id > 0 && req.query.cur_order_id) {
                const _mysql = new algaehMysql();
                _mysql
                    .executeQuery({
                        query:
                            "  select OA.analyte_id,A.description as analyte ,OA.result,A.result_unit,OA.critical_type from \
            hims_f_ord_analytes  OA   inner join hims_d_lab_analytes A on OA.analyte_id=A.hims_d_lab_analytes_id\
            where OA.order_id=?;\
            select OA.analyte_id,OA.result,OA.critical_type from hims_f_ord_analytes  OA    inner join hims_d_lab_analytes A on \
            OA.analyte_id=A.hims_d_lab_analytes_id  where OA.order_id=?; ",
                        values: [req.query.cur_order_id, req.query.pre_order_id],
                        printQuery: true
                    })
                    .then(result => {
                        _mysql.releaseConnection();

                        if (result[0].length > 0) {
                            const outputArray = [];

                            result[0].forEach(item => {
                                const data = result[1].find(val => {
                                    return val["analyte_id"] == item["analyte_id"];
                                });

                                if (data) {
                                    let valur_flucuate = "N";
                                    if (parseFloat(item["result"]) > parseFloat(data["result"])) {
                                        valur_flucuate = "U";
                                    } else if (
                                        parseFloat(item["result"]) < parseFloat(data["result"])
                                    ) {
                                        valur_flucuate = "D";
                                    }
                                    outputArray.push({
                                        analyte: item["analyte"],
                                        result_unit: item["result_unit"],
                                        cur_result: item["result"],
                                        pre_result: data["result"],
                                        cur_critical_type: item["critical_type"],
                                        pre_critical_type: data["critical_type"],
                                        valur_flucuate: valur_flucuate
                                    });
                                }
                            });
                            req.records = outputArray;
                            next();
                        } else {
                            req.records = result[0];
                            next();
                        }
                    })
                    .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                    });
            } else {
                req.records = {
                    invalid_input: true,
                    message: "Please provide Valid cur_order_id and pre_order_id"
                };
                next();
            }
        } catch (e) {
            next(e);
        }
    }
};
