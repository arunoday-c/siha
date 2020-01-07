const executePDF = function executePDFMethod(options) {
    return new Promise(function (resolve, reject) {
        try {
            const decimal_places = options.args.crypto.decimal_places;
            if (options.result.length > 0) {
                options.result.map(item => {
                    item.dispatch_quantity = parseFloat(item["dispatch_quantity"]);
                    item.return_qty = parseFloat(item["return_qty"])
                    item.unit_cost = parseFloat(item["unit_cost"]).toFixed(
                        decimal_places
                    );
                    item.extended_cost = parseFloat(item["extended_cost"]).toFixed(
                        decimal_places
                    );
                    item.discount_percentage = item["discount_percentage"]
                    item.discount_amount = parseFloat(item["discount_amount"]).toFixed(
                        decimal_places
                    );
                    item.net_extended_cost = parseFloat(
                        item["net_extended_cost"]
                    ).toFixed(decimal_places);
                    item.tax_amount = parseFloat(item["tax_amount"]).toFixed(
                        decimal_places
                    );
                    item.total_amount = parseFloat(item["total_amount"]).toFixed(
                        decimal_places
                    );

                    return item;
                });

                resolve({
                    return_total: parseFloat(options.result[0]["return_total"]).toFixed(
                        decimal_places
                    ),
                    sales_return_number: options.result[0]["sales_return_number"],
                    return_date: options.result[0]["return_date"],
                    location_description: options.result[0]["location_description"],
                    customer_name: options.result[0]["customer_name"],
                    detailList: options.result
                });
            } else {
                resolve({ detailList: options.result });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = { executePDF };
