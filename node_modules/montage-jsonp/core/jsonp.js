/**
 * @module core/jsonp
 */
var Montage = require("montage/core/core").Montage,
    Params = require('query-params'),
    Url = require("url"),
    Uuid = require("montage/core/uuid"),
    Promise = require("montage/core/promise").Promise;

/**
 * @class Jsonp
 * @extends Montage
 */
exports.Jsonp = Montage.specialize(/** @lends Jsonp# */ {
    constructor: {
        value: function Jsonp() {
            this.super();
        }
    }
}, {
    /**
     * Makes a JSONP request to the url, it returns a promise for the object returned by the request.
     *
     * @param {string} url The url for the jsonp endpoint.
     * @param {string} [callbackParameter=callback] The query string component name to be used when passing the
     *        function name to the endpoint.
     * @param {string} [servicePrefix] A prefix to use for the function name, can be useful for debugging.
     * @returns {Promise} A promise for the object returned by the request.
     */
    makeRequest: {
        value: function (url, callbackParameter, servicePrefix) {
            var deferredResponse = Promise.defer(),
                self = this,
                parsedUrl = Url.parse(url),
                params = Params.decode(parsedUrl.query || ""),
                callbackNamePrefix = servicePrefix ? servicePrefix + "ServiceCallback" : "serviceCallback",
                callbackMethodName = callbackNamePrefix + Uuid.generate().replace(/-/g, "_"),
                scriptElement = document.createElement("script"),
                requestUrl;

            window[callbackMethodName] = function(data) {
                document.head.removeChild(scriptElement);
                delete window[callbackMethodName];
                self._handleResponse(data, deferredResponse);
            };

            params[callbackParameter? callbackParameter : "callback"] = callbackMethodName;

            requestUrl = parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + Params.encode(params);
            scriptElement.src = requestUrl;

            document.head.appendChild(scriptElement);

            return deferredResponse.promise;
        }
    },

    _handleResponse: {
        value: function (data, deferred) {
            var parsedData;

            if (!data) {
                deferred.reject(new Error("Unknown API Error"));
            } else if (data.error) {
                deferred.reject(new Error(data.error));
            } else {
                deferred.resolve(data);
            }
        }
    }
});
