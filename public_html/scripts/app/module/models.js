define([
	'app',
    'backbone',
	'module/config' //get the config
],

function(app, Backbone,Config) {
    'use strict';

    // store the Modeles here
	var Models = {};
/*
|--------------------------------------------------------------------------
| News Collection
*/
    Models.NewsCollection = Backbone.Collection.extend({
        // Collection url
        url: Config.yPipeUrl,
        data: {
            _render:'json',
            _id      : '428d7eb07a7e672cfe8adf56dc80da4f',
            _callback: 'parse'
        },
        // override backbone synch to force a jsonp call
        sync: function(method, model, options) {
            var params = _.extend({
                data: this.data,
                dataType:     'jsonp',
                jsonpCallback: 'parse',
                url:          this.url,
            }, options);

            return Backbone.sync(method, model, params);
        },
        //init
        initialize: function(options) {
            options || ( options = {} );
        },
        //parse it
        parse: function(response) {
            //probably some filering or maping here
            return response.content;
        }
    });
/*
|--------------------------------------------------------------------------
| News Item Model - empty for the moment
*/
    Models.NewsItem = Backbone.Model.extend({

    });

	return Models;

});
