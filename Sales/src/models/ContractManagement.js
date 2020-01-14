import algaehMysql from "algaeh-mysql";

export function getContractManagement(req, res, next) {
    const _mysql = new algaehMysql();
    try {
        console.log("getContractManagement: ")
        _mysql
            .executeQuery({
                query: "SELECT * from hims_f_contract_management where contract_number =? ",
                values: [req.query.contract_number],
                printQuery: true
            })
            .then(headerResult => {
                if (headerResult.length != 0) {
                    _mysql
                        .executeQuery({
                            query: "select QS.*, S.service_name from hims_f_contract_management_services QS \
                            inner join hims_d_services S on S.hims_d_services_id = QS.services_id \
                            where contract_management_id=?;",
                            values: [headerResult[0].hims_f_contract_management_id],
                            printQuery: true
                        })
                        .then(contract_services => {
                            _mysql.releaseConnection();
                            req.records = {
                                ...headerResult[0],
                                ...{ contract_services }
                            };
                            next();
                        })
                        .catch(error => {
                            _mysql.releaseConnection();
                            next(error);
                        });
                } else {
                    _mysql.releaseConnection();
                    req.records = headerResult;
                    next();
                }
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

export function addContractManagement(req, res, next) {
    const _mysql = new algaehMysql();

    try {
        let input = req.body;
        let contract_number = "";

        _mysql
            .generateRunningNumber({
                user_id: req.userIdentity.algaeh_d_app_user_id,
                numgen_codes: ["CONTRACT_MANAGEMENT"],
                table_name: "hims_f_sales_numgen"
            })
            .then(generatedNumbers => {
                contract_number = generatedNumbers.CONTRACT_MANAGEMENT;

                _mysql
                    .executeQuery({
                        query:
                            "INSERT INTO hims_f_contract_management (contract_number, contract_date, customer_id, \
                                start_date, end_date, contract_code, quotation_ref_numb, terms_conditions, \
                                created_date, created_by, updated_date, updated_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        values: [
                            contract_number,
                            new Date(),
                            input.customer_id,
                            input.start_date,
                            input.end_date,
                            input.contract_code,
                            input.quotation_ref_numb,
                            input.terms_conditions,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            req.userIdentity.algaeh_d_app_user_id,
                            req.userIdentity.hospital_id
                        ],
                        printQuery: true
                    })
                    .then(headerResult => {
                        console.log("headerResult", headerResult);
                        let IncludeValues = [];
                        IncludeValues = [
                            "services_id",
                            "service_frequency",
                            "service_price"
                        ];

                        _mysql
                            .executeQuery({
                                query:
                                    "INSERT INTO hims_f_contract_management_services(??) VALUES ?",
                                values: input.contract_services,
                                includeValues: IncludeValues,
                                extraValues: {
                                    contract_management_id: headerResult.insertId
                                },
                                bulkInsertOrUpdate: true,
                                printQuery: true
                            })
                            .then(detailResult => {

                                _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = {
                                        contract_number: contract_number,
                                        hims_f_contract_management_id: headerResult.insertId
                                    };
                                    return next();
                                });
                            })
                            .catch(error => {
                                _mysql.rollBackTransaction(() => {
                                    next(error);
                                });
                            });

                    })
                    .catch(e => {
                        _mysql.rollBackTransaction(() => {
                            next(e);
                        });
                    });
            })
            .catch(e => {
                _mysql.rollBackTransaction(() => {
                    next(e);
                });
            });
    } catch (e) {
        _mysql.rollBackTransaction(() => {
            next(e);
        });
    }
};