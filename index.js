var express = require('express');
var { scrapeProfile, scrapePhotos } = require('./src/scrape');

// twelve items or less
var app = express();
app.use(require('express-promise')());

// static cling
app.use(express.static(__dirname + '/public'));

// gimme an ipa and ill give you an api
app.get('/api/:username', function(req, res) {
    const username = req.params.username;

    scrapeProfile(username)
        .then(data => res.json(data))
        .catch(data => res.status(400).json(data));
});

app.get('/api/:username/photos/:maxid', function(req, res) {
    const username = req.params.username;
    const max_id = req.params.maxid;

    scrapePhotos(username, max_id)
        .then(data => res.json(data))
        .catch(data => res.status(400).json(data));
});

// can you hear me now
app.listen(process.env.PORT || 3333);
