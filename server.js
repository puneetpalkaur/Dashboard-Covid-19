const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();



const api = require('./server/api');
var allowCrossDomain = (req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));



// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));


// API location
app.use('/api', api);


// refresh fix
app.use('/*',function(req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});


/*
// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});*/


// handle error when port already in use



//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
