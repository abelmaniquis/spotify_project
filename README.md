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
        and emitting events. Event emitters sends an event to the back end.
        
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


-----------------------------------------------------------------
Challenge 1:

Alter the application to retrieve a list of artists related to the artist you search for:
    This is done in the getRelevantArtists function
    
        -This function makes a request to Spotify's get related artists endpoint.
        -To do this, it uses the initially defined getFromApi function
         to retrieve the id of the artist.
        -This happens after the search request has emitted its end event.
        -It uses the artist id from the artist object
        
        If the request is succesful, then artist.related should be set to
        item.artists, where item is the object returned by the get related artists
        endpoint



