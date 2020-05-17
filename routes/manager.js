const apply = (app, component) => {
	component.routes.forEach((route) => {
		if(route.method.constructor.name == 'String') route.method = [route.method];
		route.method.forEach((method) => {
			if(route.handler.constructor.name == 'Function') route.handler = [route.handler];
			if(route.method == 'use') {
				route.handler.forEach((func) => {
					app.use(func);
					if(component.logger) component.logger.info(`Adding middleware: ${func.name}`);
				});
			} else {
				app[method](route.uri, ...route.handler);
				if(component.logger) component.logger.info(`Adding route: ${method.toLocaleUpperCase()} ${route.uri}`);
			}
		});
	});
};


module.exports = { apply };
