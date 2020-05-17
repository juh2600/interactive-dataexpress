const logger = require('./logger').get('main')
const express = require("express");
const pug = require("pug");
const path = require("path");

const app = express();

/*Body parser and a little interceptor usage*/
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/*Public pages*/
app.set("view engine", "pug");
app.set("views", __dirname+"/views");
app.use(express.static(path.join(__dirname+"/public")));


logger.info('Configuring routes...');
let routeFiles = ['frontend', `api/${API_VERSION}/accounts`, `api/${API_VERSION}/questions`];
const routeManager = require('./routes/manager');
routeFiles.forEach((file) => {
        logger.info(`Adding ${file} routes...`);
        let component = require(`./routes/${file}`);
        if(component.configure) component.configure({app});
        routeManager.apply(app, component);
        logger.info(`Added ${file} routes.`);
});
logger.info('Configured routes.');




app.listen(process.env.PORT);

