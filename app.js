const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
require('dotenv').config();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.error('Error getting access token:', error);
    });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            console.log(data.body.artists.items);
            res.render('artist-search-results', { artists: data.body.artists.items });
        })
        .catch(err => {
            console.log('The error while searching artists occurred: ', err);
            res.render('error');
        });
});

app.listen(3000, () => {
    console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊');
});
