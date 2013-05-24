define([
	'app',
	'backbone'
],

function(app, Backbone) {
    'use strict';
/*
|--------------------------------------------------------------------------
| Extend the global Config
*/
	var ModuleConfig = {
        yPipeUrl :'http://pipes.yahoo.com/pipes/pipe.run'
    };

	return _.extend(app.config || {} , ModuleConfig);

});
