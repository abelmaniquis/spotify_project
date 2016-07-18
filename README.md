/*
README
*/

Relevant Libraries
-------------------------------------------------
UNIREST:
    Unirest is a set of lightweight http libraries available in multiple languages,
    Unirest makes ceating requests easier.

EXPRESS:
    Express is a node.js framework which simplifies Node.js
-------------------------------------------------
GETFROMAPI FUNCTION:

The getFromApi function makes a request to the spotify API, and makes use of the
EventEmitter object to create an emitter from the inputs endpoint, and args.

    EventEmitter:
        EventEmitter lies in the events module.
            -The on property is used to bind a function with the event
            -The emit is used to fire an event.
        
        EventEmitter contains code for registering and removing listeners
        and emitting events.
        
    unirest.get: Returns a Request object with the method option set to GET
    .qs(args): queries args into a string.    
    .end: Once the function is done, if the response status is 'ok'
        return response.body.
    
    SPOTIFY API:
        To test the spotify API, put this in the console:
        curl -X GET "https://api.spotify.com/v1/artists/2aaLAng2L2aWD2FClzwiep/related-artists"
    
        This should console log an object containing the related artists to Dream Theater.
        

    When a user makes a request to /search/:name, you are going to make a
    request to the Spotify/search endpoint to find information on the artist
    which they are looking for.
    
    getFromAPI uses the following endpoint:
    /search?q=<name>&limit=1&type=artist.
    You then add listeners to the EventEmitter
    
        
    
    
EventEmitter:







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