var path = require('path');
var WebTorrent = require('webtorrent');

/**
* 프로젝트 root path 찾기
*/
var getRootPath = function() {
  var filePath = path.resolve(__dirname);
  return filePath.substring(0, filePath.lastIndexOf('/'));
};

/**
* "./resource/movie" 폴더 리턴
*/
var getDefualtMoviePath = function() {
  var rootPath = getRootPath();
  return rootPath + '/resource/movie';
};

/**
*  Human readable bytes util
*/
var prettyBytes = function(num) {
	var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	if (neg) num = -num
	if (num < 1) return (neg ? '-' : '') + num + ' B'
	exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
	num = Number((num / Math.pow(1000, exponent)).toFixed(2))
	unit = units[exponent]
	return (neg ? '-' : '') + num + ' ' + unit
}

/**
* Web Torrent module
*/
var torrentHelper = function() {
  this.downloadMap = {};
};

/**
* torrent 다운로드 요청.
*/
torrentHelper.prototype.requestDownload = function (torrentId, downloadPath) {
  // validation check
  if (typeof torrentId !== 'string' || torrentId.length == 0) {
    console.log('Invalid torrent id');
    return;
  }

  var client = new WebTorrent();
  var option = {
    path: downloadPath || getDefualtMoviePath()
  };

  var self = this;
  client.add(torrentId, option, function(torrent){
    console.log('Client is downloading: ', torrent.infoHash);
    console.log('Download path: ', torrent.path);

    // insert torrent to dictionary
    self.downloadMap[torrentId] = torrent;

    // Handle Error
    torrent.on('error', function(err) {
      console.log('Error occurred : ', err);
    });

    // Handle Download finish
    torrent.on('done', function(err) {
      console.log('Download fisished path : ' + torrent.path);
      torrent.files.forEach(function(file){
        console.log('%s[%d][%b]', file.name, file.length, file.downloaded);
      });
    });
  });
};

/**
* 다운로드 중인 torrent 의 status 를 가져온다.
*/
torrentHelper.prototype.getStats = function (torrentId) {
  if (this.downloadMap.hasOwnProperty(torrentId) == false) {
    console.log('getStats(), Failed to find torrent : ' + torrentId);
    return undefined;
  }

  var torrent = this.downloadMap[torrentId];
  // Download status
  var percent = Math.round(torrent.progress * 100);
  return {
    percent : percent,
    downloadSpeed : prettyBytes(torrent.downloadSpeed)
  };
};

module.exports.torrentHelper = torrentHelper;
