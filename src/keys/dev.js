export default {
	// API token key
	SECRETKey: 'ALGAEH Technologies PVT Ltd HIMSv1',
	TOKENTIME: 2592000, // 60 * 60 * 30 ,
	// Server port and request body limit
	port: 3000,
	bodyLimit: '1024kb',
	mysqlDb: {
		connectionLimit: 20,
		host: 'localhost',
		//host: "49.206.18.38",
		//host: "127.0.0.1",
		//host: "192.168.1.10",
		port: 3306,
		user: 'algaeh_root',
		password: 'alg_hea2018',

		//database: "security_algaeh_hims_db",
		// database: "algaeh_hims_db",
		database: 'hims_test_db',
		// database: "seco",
		// database: "algaeh_hrms_oman_db",
		//database: "medical_db",
		multipleStatements: true,
		acquireTimeout: 20000,
		dateStrings: true,
		insecureAuth: true,
		waitForConnections: true, // Default value.
		queueLimit: 0, // Unlimited - default value.
		supportBigNumbers: true,
		bigNumberStrings: true
	},

	// mysqlDb: {
	//   connectionLimit: 20,
	//   host: "49.206.18.38",
	//   port: 3306,
	//   user: "algaeh_root",
	//   password: "medteam2013",
	//   database: "algaeh_hims_db",
	//   multipleStatements: true,
	//   acquireTimeout: 20000,
	//   dateStrings: true
	// },
	//Db Date format
	dbFormat: {
		date: 'YYYY-MM-DD'
	},

	logpath: '/logs', //log folder path
	logFileSize: '20m', //maximum size of log file.
	logFileDatePatter: 'YYYYMMDD',
	logLevel:
		'debug' /*log printing based on parameters; 
 2 info:{Warning,infomation,error};
 1 warn:{warning,error};
 0 error:{error},
 4 debug:{debug,error,warning,information}
 */,
	/* AWS Translator api settings */
	AWSCredentials: {
		accessKeyId: 'AKIAI3LBOY7VFNGLQFWA',
		secretAccessKey: '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',
		region: 'us-east-1',
		endpoint: 'https://translate.us-east-1.amazonaws.com'
	},
	/* folder path for language changing */
	languageFolderPath: '/media/syed/Office/ALGAEH/DEV/HIMS/hims-app/logs',
	fileStorageInDB: false
};
