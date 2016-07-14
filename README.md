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
