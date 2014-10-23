This package provides a MontageJS object that can handle jsonp requests.

Example
=======

```javascript
var Jsonp = require("jsonp").Jsonp;

Jsonp.makeRequest("http://echo.jsontest.com/key/value/one/two")
.then(function(response) {
    // consume response object
})
```

```javascript
Jsonp.makeRequest("http://www.reddit.com/r/kittens.json?limit=100", "jsonp")
.then(function(response) {
    // show kittens
})
```

Documentation
=============

`Json.makeRequest(url, callbackParameter, servicePrefix)` -> {Promise} A promise for the object returned by the request.

 - `url` {string} The url for the jsonp endpoint.
 - `[callbackParameter]` {string} The query string component name to be used when passing the function name to the endpoint. `"callback"` by default.
 - `[servicePrefix]` {string} A prefix to use for the function name, can be     useful for debugging.
