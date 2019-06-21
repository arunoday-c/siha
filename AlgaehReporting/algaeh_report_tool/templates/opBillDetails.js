const algaehUtilities = require('algaeh-utilities/utilities');
const executePDF = function executePDFMethod(options) {
	return new Promise(function(resolve, reject) {
		const utilities = new algaehUtilities();
		try {
			const _ = options.loadash;
			let str = '';
			let input = {};
			let params = options.args.reportParams;

			params.forEach((para) => {
				input[para['name']] = para['value'];
			});

			if (input.service_type_id > 0) {
				str += `and  BD.service_type_id=${input.service_type_id}`;
			}

			options.mysql
				.executeQuery({
					query: `select BH.bill_date,BH.hims_f_billing_header_id,BH.bill_number,BD.services_id,sum(BD.net_amout) as total_amount,
			ST.service_type_code,ST.service_type,S.service_code,S.service_name
			from hims_f_billing_header BH inner join hims_f_billing_details BD on
			BH.hims_f_billing_header_id=BD.hims_f_billing_header_id  inner join hims_d_service_type ST
			on BD.service_type_id=ST.hims_d_service_type_id and ST.record_status='A'
			inner join hims_d_services S on  BD.services_id = S.hims_d_services_id and S.record_status='A'
			where    BH.hospital_id=? and date(bill_date)   between    date(?) and  date(?) 
			and   BH.record_status='A'  and BD.record_status='A'  ${str} group by BD.services_id;	`,
					values: [ input.hospital_id, input.from_date, input.to_date ],
					printQuery: true
				})
				.then((results) => {
					const result = _.chain(results)
						.groupBy((g) => g.service_type)
						.map(function(dtl, key) {
							const sum_amount = _.chain(dtl).sumBy((s) => parseFloat(s.total_amount)).value().toFixed(2);
							return {
								service_type: key,
								detailList: dtl,
								sum_amount: sum_amount
							};
						})
						.value();

					utilities.logger().log('result: ', result);

					resolve({ detail: result });
				})
				.catch((error) => {
					options.mysql.releaseConnection();
					console.log('error', error);
				});
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = { executePDF };
