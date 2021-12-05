'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieParser());
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept'); 
  res.header('Access-Control-Allow-Credentials', true); 
  next();
});


app.get('/', function (req, res) {
  res.send('Web Api NTH-DOC By ThemeSanasang. V.1')
});

app.use('/', [
  require('./routes/user_routes'),
  require('./routes/doc_receive_routes'),
  require('./routes/doc_group_routes'),
  require('./routes/doc_agency_routes'),
  require('./routes/doc_receiver_routes')
])


module.exports = {
    path: '/api',
    handler: app,
}