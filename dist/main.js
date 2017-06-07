'use strict';

var socket = io();

var App = function () {

  var init = function init() {
    socketListeners();
  };

  var socketListeners = function socketListeners() {
    socket.on('current', function (track) {
      changeAlbum(track);
    });
  };

  var Elements = {
    albumCover: document.getElementById('albumCover'),
    songTitle: document.getElementById('songTitle'),
    albumTitle: document.getElementById('albumTitle'),
    nowPlaying: document.getElementById('nowPlaying')
  };

  var changeAlbum = function changeAlbum(track) {
    albumCover.classList.toggle('hide');
    albumCover.src = track.image[3]['#text'];
    setTimeout(function () {
      albumCover.classList.toggle('hide');
      albumCover.classList.toggle('show');
    }, 1000);
    songTitle.innerHTML = '' + track.name;
    albumTitle.innerHTML = track.artist['#text'] + ' - ' + track.album['#text'];
    nowPlaying.innerHTML = track['@attr'] ? 'Now Playing' : 'Not Playing';
    document.body.style.background = '' + track.colorArray[0];
    albumCover.style.boxShadow = '0 0 100px ' + track.colorArray[1];
    albumTitle.style.color = '' + track.colorArray[3];
    songTitle.style.color = '' + track.colorArray[3];
    nowPlaying.style.color = '' + track.colorArray[3];
  };

  return {
    init: init
  };
}();

App.init();