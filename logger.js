/**
 * Usage:
 * var logger = require('logger').get('context_name')
 * logger.log('stuff') // yields a message prefixed with '[context_name]'
 */
exports.get = function(role, options = {}) {
	let logger_func = (type) => {
		return (content) => { console.log(`${type}:\t[ ${role} ] ${content}`); };
	};
	let logger = {
		info: logger_func('info'),
		warn: logger_func('warn'),
		error: logger_func('error'),
		debug: logger_func('debug')
	}
	return logger;
};
