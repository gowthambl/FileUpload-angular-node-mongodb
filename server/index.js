import path from 'path';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

import Router from './routes/index'
import Defines from './config'

const app = express();
const Routes = Router();
const server = new http.Server(app);
const port = Defines.APP_PORT;

// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    if (req.method === 'OPTIONS') {
        res.send(204);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, './src/app')));

// console.log(path.join(__dirname,'views'));

app.use('/', Routes);


server.listen(port, () => {
    console.log('Server started on port %d', port);
});

exports.server = server;