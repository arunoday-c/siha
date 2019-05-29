const executePDF = function executePDFMethod(options) {
	const _ = options.loadash;
	return new Promise(function(resolve, reject) {
		try {
			let str = '';

			let input = {};
			let params = options.args.reportParams;

			params.forEach((para) => {
				input[para['name']] = para['value'];
			});

			if (input.provider_id > 0) {
				str += ` and A.provider_id= ${input.provider_id}`;
			}

			if (input.status_id > 0) {
				str += ` and A.appointment_status_id= ${input.status_id}`;
			}
			options.mysql
				.executeQuery({
					query: `select hims_f_patient_appointment_id,appointment_date,appointment_from_time,appointment_to_time,
            s.description as app_status,s.default_status, patient_name,patient_code,A.age,contact_number,cancelled,appointment_remarks,
            E.full_name as doctor_name,E.employee_code as doctor_code ,cancel_reason,concat(D.full_name,'-' ,D.employee_code)as updated_by from 
            hims_f_patient_appointment A inner join hims_d_employee E on A.provider_id=E.hims_d_employee_id
            inner join hims_d_appointment_status S on A.appointment_status_id=S.hims_d_appointment_status_id
            left join algaeh_d_app_user U on A.updated_by=U.algaeh_d_app_user_id
            left join  hims_d_employee D on  U.employee_id=D.hims_d_employee_id
            where A.sub_department_id=? ${str} and A.hospital_id=? and  appointment_date between date(?) and date(?) 
            order by appointment_date`,
					values: [ input.sub_department_id, options.args.hospital_id, input.from_date, input.to_date ],
					printQuery: true
				})
				.then((result) => {
					//console.log('result', result);
					const data = _.chain(result)
						.groupBy((g) => g.doctor_code)
						.map(function(detail, key) {
							return {
								doctor_code: key,
								doctor_name: detail[0]['doctor_name'],
								details: detail
							};
						})
						.value();
					console.log('data', data);
					resolve({ groupdetails: data });
				})
				.catch((error) => {
					_mysql.releaseConnection();

					console.log('error', error);
					res.writeHead(400, { 'Content-Type': 'text/plain' });
					res.end(error);
				});
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = { executePDF };
