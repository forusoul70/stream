var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var app = express();
var streamHelper = new (require('./module/streamHelper.js')).streamHelper();

// initialize
app.set('views', './views');
app.use('/resource/', express.static(__dirname + '/resource'));

var server = app.listen(8080, function() {
  var port = server.address().port;
  console.log('App now running on port ', port);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/grid.html'));
});

// Demo 용
app.get('/streaming/:file', (req, res) => {
  streamHelper.responseMovie(req, res);
});
