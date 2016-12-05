var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var app = express();
var streamHelper = new (require('./module/streamHelper.js')).streamHelper();
var fileLogger = new (require('./module/fileLogger.js')).fileLogger();

// initialize
app.set('views', './views');
app.use('/resource/', express.static(__dirname + '/resource'));

var server = app.listen(8080, function() {
  var port = server.address().port;
  fileLogger.log('App now running on port ', port);
  console.log('App now running on port ', port);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/grid.html'));
});

// streaming
app.get('/movie/:movie', (req, res) => {
  var movie = req.params.movie;
  console.log(encodeURI(movie + 'index.m3u8'));
  res.redirect('/streaming/' + movie + '.m3u8');
});

app.get('/streaming/:file', (req, res) => {
  streamHelper.responseMovie(req, res);
});
