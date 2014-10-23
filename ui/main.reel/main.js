/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var Jsonp = require("montage-jsonp/core/jsonp").Jsonp;
var API_KEY = "dbf71473cf25bbd06939baef47b626eb";
/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() {
            this.super();
        }
    },
    templateDidLoad: {
        value: function Main() {

            var flow = this.templateObjects.flow;            

            Jsonp.makeRequest("https://api.themoviedb.org/3/movie/now_playing?api_key="+API_KEY)
            .then(function(response) {
                flow.content = response.results
            })             
        }
    },

    flowDidTranslateStart: {
        value: function (flow) {

        }
    },

    flowDidTranslateEnd: {
        value: function (flow) {
            var ID = flow.content[flow.scroll].id
            var details = this.templateObjects.details;

            Jsonp.makeRequest("https://api.themoviedb.org/3/movie/" +ID + "?api_key=" + API_KEY)
            .then(function(response) {
                details.data = response
                console.log(response)
            }) 
        }
    },

    handleTrailer_btnAction: {
        value: function (event) {
            this.templateObjects.overlay.show();
            document.querySelector('.content').classList.toggle('shrink')
            var flow = this.templateObjects.flow;  

            var FRAME = this.player;            
            var PROMISE = this.templateObjects.promiseController;

            var TRAILERS_FEED = "https://gdata.youtube.com/feeds/api/videos?q=%s+official+trailer&max-results=1&v=2&alt=json";
            
            var title = flow.content[flow.scroll].title;
            
            var searchString = title.split(' ').join('+');
            var searchUrl = TRAILERS_FEED.replace("%s", searchString);
            PROMISE.determinate = true;
            PROMISE.promise = Jsonp.makeRequest(searchUrl)
            .then(function(response) {
                FRAME.src = "https://www.youtube.com/embed/%s".replace("%s", response.feed.entry[0].media$group.yt$videoid.$t)
            }) 

        }
    },

    handleCloseBtnAction: {
        value: function (event) {
            this.player.src = ""   
            this.templateObjects.overlay.hide();
            document.querySelector('.content').classList.toggle('shrink')
        }
    },

    handleToggleAction: {
        value: function (event) {
            console.log("TOGGLE")
            var qq = document.querySelectorAll('nav > ul')[0];
            qq.classList.toggle('expanded')  
        }
    },
    draw: {
        value: function() {

            var flow = this.templateObjects.flow; 
            setTimeout(function(){
                flow.startScrollingIndexToOffset(7, 0)
            },1000)

        }
    }
});
