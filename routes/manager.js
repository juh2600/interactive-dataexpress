const apply = (app, component) => {
	component.routes.forEach((route) => {
		if(route.method.constructor.name == 'String') route.method = [route.method];
		route.method.forEach((method) => {
			if(route.handler.constructor.name == 'Function') route.handler = [route.handler];
			app[method](route.uri, ...route.handler);
			if(component.logger) component.logger.info(`Adding route: ${method.toLocaleUpperCase()} ${route.uri}`);
		});
	});
};


module.exports = { apply };
