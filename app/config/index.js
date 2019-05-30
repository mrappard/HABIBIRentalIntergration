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
	logger
};