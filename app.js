require('dotenv').config()
const express = require('express');
const config = require('./config/config.js');
const defaults = require('./config/defaults.js');
const path = require('path');
const getColors = require('get-image-colors');
const LastFmNode = require('lastfm').LastFmNode;


const app = express();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const port = config.PORT;

app.set('view engine', 'pug')

app.use('/dist', express.static(path.join(__dirname, 'dist')));


const lastfm = new LastFmNode({
  api_key: config.API_KEY,
  secret: config.API_SECRET
});

//TODO: io and stream in different module
const trackStream = lastfm.stream('eua');

//TODO: Clean this up
let currentTrack = defaults.DEFAULT_SONG;

let currentColorArray = defaults.DEFAULT_COLORS;

let defaultImage = defaults.DEFAULT_IMAGE;


trackStream.start();

//This code makes me wanna take a shower but whatever
//TODO: Split into smaller function
trackStream.on('nowPlaying', track => {
  if(track === undefined){
    io.emit('current', Object.assign(currentTrack, { currentColorArray }))
  }else{
    currentTrack = track;
    if(track.image[3]['#text'] === ''){
      track.image[3]['#text'] = defaultImage;
    }
    let image = track.image[3]['#text'];
    getColors(image)
      .then(colors => colors.map(color => color.css()))
      .then(colorArray => {
        currentColorArray = colorArray;
          io.emit('current', Object.assign(track, { colorArray }))
      })
      .catch(console.log);
  }
});

trackStream.on('error', error =>{
  console.log(error);
});


app.get('/', (req,res) => {
  res.render('index', { currentTrack, currentColorArray });
})

server.listen(port, () => {
  console.log("+---------------------------------------+");
  console.log("|                                       |");
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${port} 🤖  \x1b[37m |`);
  console.log("|                                       |");
  console.log("\x1b[37m+---------------------------------------+");
});