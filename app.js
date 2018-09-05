require('dotenv').config();
const path = require('path');
const express = require('express');
const getColors = require('get-image-colors');
const { 
  DEFAULT_SONG,
  DEFAULT_IMAGE,
  DEFAULT_COLORS
} = require('./config/defaults.js');
const trackStream = require('./config/lastfm');

const app = express();
const server = require('http').createServer(app);  
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;

app.set('view engine', 'pug')

app.use('/dist', express.static(path.join(__dirname, 'dist')));

let lastPlayedTrack = DEFAULT_SONG;
let colorsOfLastPlayedTrack = DEFAULT_COLORS;
let defaultImage = DEFAULT_IMAGE;

trackStream.start();

trackStream.on('nowPlaying', async (track) => {
  if(!track){
    io.emit('current', Object.assign({}, lastPlayedTrack, { colorsOfLastPlayedTrack }))
  }else{
    lastPlayedTrack = track;
    track.image[3]['#text'] = track.image[3]['#text'] ? track.image[3]['#text'] : defaultImage
    let image = track.image[3]['#text'];
    const colors = await getColors(image).catch(console.log);
    const cssColors = await colors.map(color => color.css());
    colorsOfLastPlayedTrack = cssColors;
    io.emit('current', Object.assign({}, track, { cssColors })) 
  }
});

trackStream.on('error', error =>{
  console.log(error);
});

app.get('/', (req,res) => {
  res.render('index', { lastPlayedTrack, colorsOfLastPlayedTrack });
})

server.listen(port, () => {
  console.log("+---------------------------------------+");
  console.log("|                                       |");
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${port} 🤖  \x1b[37m |`);
  console.log("|                                       |");
  console.log("\x1b[37m+---------------------------------------+");
});