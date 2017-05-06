var express = require('express');
var { scrapeProfile, scrapePhotos } = require('./src/scrape');

// twelve items or less
var app = express();
app.use(require('express-promise')());

// static cling
app.use(express.static('public'));

// gimme an ipa and ill give you an api
app.get('/api/:username', function(req, res) {
    const username = req.params.username;

    res.json(scrapeProfile(username));
});

app.get('/api/:username/photos/:maxid', function(req, res) {
    const username = req.params.username;
    const max_id = req.params.maxid;

    res.json(scrapePhotos(username, max_id));
});

// can you hear me now
app.listen(3333);
