# LastFM Album Viewer

>This app listens to a users last.fm scrobbling, grabs the colors from the album cover to that song and then sets the background, shadow and text color to those colors.

![Johnny boooi!](https://i.imgur.com/v6mQmZV.png)

## Instructions

* Create app on https://www.last.fm/api
* Put credentials into `.env.example`
* rename `.env.example` > `.env`
* `npm start`

## TODOS

* Write function to check for contrast, some album covers look odd
* Link to spotify or implement spotify API

## packages

* lastfm
* get-image-colors
* socket.io
* express