var path = require('path');
var fs = require('fs');
var RESOURCE_PATH = 'resource/demo/';

/**
* 파일이 존재하는 검사
**/

var _isFileExist = function(filePath) {
  return new Promise(function(exist) {
    fs.exists(filePath, function(isExist) {
      if (isExist) { // 존재 할때
        exist();
      } else { // 존재 하지 않을 때
        throw 'File not exist [' + filePath + ']';
      }
    });
  });
}

/**
* 파일 사이즈를 가지고 오는 함수
**/
var _getFileSize = function(filePath) {
  return new Promise(function(size) {
    fs.stat(filePath, function(err, stat) {
      size(stat.size);
    });
  });
}

/**
* send M3u8
**/
var _sendM3u8 = function(filePath, res) {
  fs.readFile(filePath, function(err, content) {
    if (err) {
      res.status(400).send('Error when read file : ' + fileName);
    } else if (content) {
      res.header('Content-Type', 'application/vnd.apple.mpegurl');
      res.status(200).send(content);
    } else {
      res.status(400).send('Empty play list');
    }
  });
}

/**
* send ts
**/
var _sendTsStream = function(filePath, res) {
  _getFileSize(filePath).catch(function(e) {
    console.log('Failed to get file size');
    res.status(400).send('Failed to get file size [' + filepath + ']');
  }).then(function(size) {
    res.header('Content-Type', 'video/mp2t');
    res.header('Accept-Ranges', 'bytes');
    res.header('Content-Length', size);
    res.header('Connection', 'keep-alive');

    var stream = fs.createReadStream(filePath);
    console.log('try to create read stream');
    // for debug
    stream.on('data', function(data) {
	     console.log('loaded part of the file');
     });

    stream.on('end', function () {
    	console.log('all parts is loaded');
    });

    stream.on('error', function(err) {
    	console.log('something is wrong : [' + err + ']');
    });

    // pipe to response
    stream.pipe(res);
    });
  }

module.exports.streamHelper = function() {
  /**
  * Response for stremaing request
  **/
  this.responseMovie = function(req, res) {
    var filePath = path.join(global.appRoot, RESOURCE_PATH + req.params.file);
    _isFileExist(filePath).catch(function(e){
      res.stats(400).send(e);
    }).then(function(){
      switch (path.extname(req.params.file)) {
        case '.m3u8':
          _sendM3u8(filePath, res);
          break;
        case '.ts':
          _sendTsStream(filePath, res);
          break;
        default:
      }
    });
  }
}
