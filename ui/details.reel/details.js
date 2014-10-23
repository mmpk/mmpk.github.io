/**
 * @module ui/details.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Details
 * @extends Component
 */
exports.Details = Component.specialize(/** @lends Details# */ {
    constructor: {
        value: function Details() {
            this.super();
        }
    },
    _data: {value: null},

    data: {
        set: function (value) {
            if(this._data != value) this._data = value
                },
        get: function () {
            return this._data
        }
    }
});
