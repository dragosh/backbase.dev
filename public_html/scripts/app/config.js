require.config({
	deps: ['main'],
	paths: {
		// Libraries
		jquery       : '../components/jquery/jquery',
		backbone     : '../components/backbone/backbone',
		underscore   : '../components/underscore/underscore',
		handlebars   : '../components/handlebars/handlebars',
		layoutmanager: '../components/layoutmanager/backbone.layoutmanager',
		routefilter  : '../components/backbone-route-filter/backbone-route-filter',
		localstorage : '../components/backbone.localStorage/backbone.localStorage',
		imagesloaded : '../vendors/jquery.imagesloaded'

	},

	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		underscore: {
			exports: '_'
		},

		handlebars: {
			exports: 'Handlebars'
		},
		layoutmanager: {
			deps: ['backbone', 'jquery']
		},
		routefilter: {
			deps: ['backbone']
		},
		localstorage: {
			deps: ['backbone']
		},
		imagesloaded: {
			deps: ['jquery']
		}
	},
	map: {

	}
});

