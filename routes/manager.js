const apply = (app, component) => {
	component.routes.forEach((route) => {
		route.methods.forEach((method) => {
			app[method](route.uri, route.handler);
			if(component.logger) component.logger.info(`Adding route: ${method.toLocaleUpperCase()} ${route.uri}`);
		});
	});
};


module.exports = { apply };
