//related artists dream theater
//curl -X GET "https://api.spotify.com/v1/artists/2aaLAng2L2aWD2FClzwiep/related-artists"

/*
Break each library down.
Test these libraries first.
work on the project incrementally.
*/

/*
Work slowly.
*/

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
            /*Here, we make a request to the get related artists endpoint.
              If the request is succesful, then artist.related should be set to item.artists
              where item is the object returned by the get related artists endpoint.
            */
            });
    return emitter; //We get the data, emit it, and then catch it in emitter
    /*
    Event emitter sends an event to the back end
    This is no different from events in jquery, 
    
    */
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
        //console.log(artist);
        //res.json(artist);
        
        /*Once the search request finishes, 
        we start a search for relevant artists.*/
        var relevant = getRelevantArtists(id);
        
        relevant.on('end',function(artistData){
            var artists = artistData.artists;
            res.json(artists);
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