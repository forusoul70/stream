var path = require('path');
global.appRoot = path.resolve(__dirname);
global.modulePath = global.appRoot + "/module"

var express = require('express');
var app = express();
var streamHelper = new (require('./module/streamHelper.js')).streamHelper();
var fileLogger = new (require('./module/fileLogger.js')).fileLogger();

// initialize
app.set('views', './views');
app.use('/resource/', express.static(__dirname + '/resource'));
app.use('/js/', express.static(__dirname + '/js'));
app.use('/css/', express.static(__dirname + '/css'));

var server = app.listen(80, function() {
  var port = server.address().port;
  process.on('uncaughtException', function (err) {
    fileLogger.error('uncaughtException : ' + err);
  });
  fileLogger.log('App now running on port ', port);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/grid.html'));
});

// hls
app.get('/hls/:movie', (req, res) => {
  var movie = req.params.movie;
  res.redirect('/file/' + movie + '.m3u8');
});

app.get('/file/:file', (req, res) => {
  streamHelper.responseMovie(req, res);
});

// psuedo streaming
app.get('/pseudo/:movie', (req, res) => {
  streamHelper.responsePseudoMovie(req, res);
});

app.get('/webTorrentDemo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/webTorrentDemo.html'));
});
