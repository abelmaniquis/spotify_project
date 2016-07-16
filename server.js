//related artists dream theater
//curl -X GET "https://api.spotify.com/v1/artists/2aaLAng2L2aWD2FClzwiep/related-artists"

var unirest = require('unirest');
var express = require('express');
var events = require('events');

//Calls the Spotify API

/*var test = unirest.get("https://api.spotify.com/v1/artists/2aaLAng2L2aWD2FClzwiep/related-artists");
console.log(test.qs());
*/
var getFromApi = function(endpoint, args) {
    console.log(endpoint);
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint) 
           .qs(args)//This queries the string
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
    return emitter;
};


/*
When a user makes a request to /search/:name, you are going to make a
request to the Spotify/search endpoint to find information on the artist
which they are looking for.
*/
var app = express();
app.use(express.static('public'));      //node.static calls the front end.
/*
When a request to /search/:name is made, 

getFromAPI uses the following endpoint:
/search?q=<name>&limit=1&type=artist.

You then add listeners to the EventEmitter
*/
app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('artists/43ZHCT0cAZBISjO8DG9PnE/related-artists', { //This is what is being passed as the endpoint on line 13
        q: req.params.name, 
        limit: 1,
        type: 'artist'
    });

    searchReq.on('end', function(item) {
        var artist = item.artists; //originally: var artist = item.artists.items[1];
        res.json(artist);
        console.log("artist object:")
        console.log(artist);
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});

app.listen(8080);