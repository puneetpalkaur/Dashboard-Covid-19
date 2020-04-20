const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
//CORS
let app = express();
let allowCrossDomain = (req, res, next) => {
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

app.use(bodyParser.json());


app.get('/getData', async (req, res) => {
  let response;

  try {
    response =  await axios.get('https://corona.lmao.ninja/v2/countries');
    const { data = [] } = response;
    return res.send(data);
      } catch(e) {
    console.log(`Failed to fetch countries: ${e.message}`, e);
    return res.json({
      message: 'Failure'
    });
  }

});

module.exports = app;
