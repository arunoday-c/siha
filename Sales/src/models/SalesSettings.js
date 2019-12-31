import algaehMysql from "algaeh-mysql";

export default {

    getSalesOptions: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            _mysql
                .executeQuery({
                    query: "select * from hims_d_sales_options;",
                    printQuery: false
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
    addSalesOptions: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            let input = { ...req.body };
            _mysql
                .executeQuery({
                    query:
                        "INSERT INTO `hims_d_sales_options` (`sales_order_auth_level`, `services_required`, \
                        `created_date`, `created_by`, `updated_date`, `updated_by`)\
                        VALUE(?, ?, ?, ?, ?)",
                    values: [
                        input.sales_order_auth_level,
                        input.services_required,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id
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
    updateSalesOptions: (req, res, next) => {
        const _mysql = new algaehMysql();
        try {
            let input = { ...req.body };
            _mysql
                .executeQuery({
                    query:
                        "UPDATE `hims_d_sales_options` SET `sales_order_auth_level` = ?, `services_required`=?, `updated_date`=?, `updated_by`=? \
                WHERE `hims_d_sales_options_id`=? ;",
                    values: [
                        input.sales_order_auth_level,
                        input.services_required,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        input.hims_d_sales_options_id
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
    }
};
