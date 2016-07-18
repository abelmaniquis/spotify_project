var unirest = require('unirest'); //learn about all of these modules. Unirest is a library for 
var express = require('express');
var events = require('events'); //natively inside node.js

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint) 
           .qs(args)
           .end(function(response) {
                if (response.ok) {
                    emitter.emit('end', response.body);//end event is emitted, extracts the artist and returns it in a response.
                }
                else {
                    emitter.emit('error', response.code);
                }
            });
    return emitter;
};

var app = express();
app.use(express.static('public'));      

app.get('/search/:name', function(req, res) {
    
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });

    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        var id = item.artists.items[0].id;
        var relevant = getRelevantArtists(id); //Defined on line 68.
        
        relevant.on('end',function(item){
            artist.related = item.artists;
            console.log(artist);
            res.json(artist);
            });
        
        relevant.on('error', function(code) {
            res.sendStatus(code);
        });
    
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
    
    var getRelevantArtists = function(id){
        var relevantArtists = getFromApi('artists/' + id + '/related-artists');
        return relevantArtists;
    }
    
    var getTopTracks = function(id){
        var topTracks = getFromApi('artists/' + id +'/top-tracks');
        return topTracks;
    }
});

app.listen(8080);