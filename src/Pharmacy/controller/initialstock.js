import { Router } from 'express';
import { releaseConnection } from '../../utils';
import httpStatus from '../../utils/httpStatus';
import {
	addPharmacyInitialStock, //Done
	getPharmacyInitialStock, //Done
	updatePharmacyInitialStock //Done
} from '../model/initialstock';

export default ({ config, db }) => {
	let api = Router();

	// created by Nowshad :to add Pharmacy Initial Stock
	api.post(
		'/addPharmacyInitialStock',
		addPharmacyInitialStock,
		(req, res, next) => {
			let result = req.records;
			res.status(httpStatus.ok).json({
				success: true,
				records: result
			});
			next();
		},
		releaseConnection
	);

	// created by irfan :to getPharmacyInitialStock
	api.get(
		'/getPharmacyInitialStock',
		getPharmacyInitialStock,
		(req, res, next) => {
			let result = req.records;
			res.status(httpStatus.ok).json({
				success: true,
				records: result
			});
			next();
		},
		releaseConnection
	);

	// created by Nowshad :update Item Storage
	api.put(
		'/updatePharmacyInitialStock',
		updatePharmacyInitialStock,
		(req, res, next) => {
			let results = req.records;
			res.status(httpStatus.ok).json({
				success: true,
				records: results
			});
			next();
		},
		releaseConnection
	);

	return api;
};
