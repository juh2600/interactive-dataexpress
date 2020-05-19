const package = require('./package.json');
console.log(`Starting ${package.name} v${package.version}`);
//process.env.NODE_ENV = 'production'; // this will cause a warning from express-session; it's ok
process.env.NODE_ENV = 'debug';

const logger = require('./logger').get('main')
const express = require("express");
const path = require("path");
require('dotenv').config();

const app = express();

/*Body parser and a little interceptor usage*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/*Public pages*/
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use(express.static(path.join(__dirname+"/public")));


logger.info('Configuring routes...');
let routeFiles = [`api/${process.env.API_VERSION}/accounts`, 'frontend'];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
        logger.info(`Adding ${file} routes...`);
        let component = require(`./routes/${file}`);
        if(component.configure) component.configure({app});
        routeManager.apply(app, component);
        logger.info(`Added ${file} routes.`);
});
logger.info('Configured routes.');



logger.info(`Listening on port ${process.env.PORT}`);
app.listen(process.env.PORT);

