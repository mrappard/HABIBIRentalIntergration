const winston = require('winston');

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new winston.transports.File({
			name: 'error',
			filename: 'error.log', 
			level: 'error',
			handleExceptions: true,
			json: false,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			timestamp: true
		}),
		new winston.transports.File({
			name: 'info',
			filename: 'info.log',
			level: 'info',
			handleExceptions: false,
			json: false,
			colorize: true})
	],
	exitOnError: false
});

winston.stream({ start: -1 }).on('info', function(log) {
	console.log(log);
});

winston.stream({ start: -1 }).on('error', function(log) {
	console.log(log);
});

module.exports = {
	secret : 'e72257a03bb6fd583bc7e28dacg1c01b211417805126e836ec2631d1a56d3422',
	logger,
	cloudant: {
		account: '5889e324-25b7-4501-bf23-ccbc70434d3f-bluemix',
		plugins: {
			iamauth: {
				iamApiKey: '5N6Xgo3H6Yn5-4bvpU-y3mbLSfVjGyZoAL8sKg1_11KU'
			}
		}
	}
};