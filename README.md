Alter the above application to retrieve a list of artists related to the artist you search for.

In order to do this you will need to:

Make a request to the get related artists endpoint
This should happen after the search request has emitted its end event
It should use the artist ID from the artist object

If the request is successful, then artist.related should be set to item.artists, where item is the object returned by the get related artists endpoint.
The entire artist object should then be sent as a response to the client.

If the request is unsuccessful then a 404 error should be returned.
Test out your code using the front end. You should see a list of related artists added below the artist which you search for.

# spotify_project






var unirest = require('unirest');
var express = require('express');
var events = require('events');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint)
           .qs(args)
           .end(function(response) {
                if (response.ok) {
                    emitter.emit('end', response.body);
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
        res.json(artist);
        console.log("This is searchReq.on");
        
        console.log(artist);
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });
});

app.listen(8080);