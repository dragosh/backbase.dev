define([
    'handlebars', // template engine
    'helpers/handlebars_helper', // template engine helpers
    'layoutmanager', // backbone view manager plugin
    'routefilter', // backbone routefilter plugin
    'imagesloaded' // jquery imagesloaded plugin
],
function(Handlebars) {

    'use strict';
/*
|--------------------------------------------------------------------------
|   Create the Main app Object Here
|--------------------------------------------------------------------------
*/

    var app = new ( Backbone.View.extend({

        debug: true,
        root: '/',
        // listen for the app events
        initialize: function() {

            $(window).resize(this.setLayoutViewport);
            this.on('layout:beforeRender', this.onBeforeLayoutReady , this);
            this.on('layout:afterRender', this.onAfterLayoutReady , this);
            this.on('domchange:title', this.onDomChangeTitle , this);
        },
        // events on the start up
        events:{

            'click a:not([data-bypass])': function(ev){
                //Get the absolute anchor href.
                var href = { prop: $(ev.currentTarget).prop('href'), attr: $(ev.currentTarget).attr('href') };
                // Get the absolute root.
                var root = location.protocol + '//' + location.host + this.root;
                // Ensure the root is part of the anchor href, meaning it's relative.
                if (href.prop.slice(0, root.length) === root) {
                    // If the href exists and is a empty hash exit;
                    if(href.attr === '#') { return false; }
                    ev.preventDefault();
                    href = (Backbone.history.options.pushState === true) ? href.attr : this.root + href.attr;
                    Backbone.history.navigate(href,  true);
                }
            }
        },
        //start the application
        start: function(Router,bootstrap) {

            this.router = new Router(bootstrap);
            Backbone.history.start({ pushState: true});

        },
        // get window dimentions and store them for posible use later
        // determine the Layout ViewPort (Posible refactoring)
        setLayoutViewport: function() {
            app.dimensions = {
                w: $(window).innerWidth(),
                h: $(window).innerHeight()
            };
            var headerView = app.layout.getViews('header').value()[0];
            var sidebarView = app.layout.getViews('aside').value()[0];
            var footerView = app.layout.getViews('footer').value()[0];
            var pageView = app.layout.getViews('#pages').value()[0];

            //header
            if( ! _.isUndefined(headerView) ) {
                app.dimensions.header = {
                    w : headerView.$el.parent().outerWidth(),
                    h : headerView.$el.parent().outerHeight()
                }
            }
            //Sidebar
            if( ! _.isUndefined(sidebarView) ) {
                app.dimensions.sidebar = {
                    w : sidebarView.$el.outerWidth(),
                    h : sidebarView.$el.outerHeight()
                };
                var listHeight = app.dimensions.h - ( sidebarView.$('nav').outerHeight() + app.dimensions.header.h) ;
                sidebarView.$('.items-list').height( listHeight );
            }
            // set the viewport
            if( ! _.isUndefined(footerView) && ! _.isUndefined(pageView) ) {
                app.viewport = {
                    w: app.dimensions.w -  app.dimensions.sidebar.w,
                    h: app.dimensions.h - (app.dimensions.header.h + app.dimensions.header.h / 3 )
                };
                footerView.$el.width(app.viewport.w);
                pageView.$el.width(app.viewport.w);
                pageView.$el.height(app.viewport.h);
            }
        },

        useLayout: function(options) {
            var defaults = {};
            return new Backbone.Layout(_.extend(defaults, options));
        },

        //notification
        growl: function(options){

            return typeof options === 'object' ? $.gritter.add(options) : false;
        },
        log: function(severity, message){
            // TO DO
            // debug function ex ( app.log(1,'Message'); )
        },
        /*
        |--------------------------------------------------------------------------
        | general trigger handlers
        */

        onBeforeLayoutReady: function() {
            //Do something before the layout is rendered
        },
        onAfterLayoutReady: function() {
            //Do something after the layout is rendered
            //set the viewport
            this.setLayoutViewport();
        },
        onDomChangeTitle: function (title) {
            $(document).attr('title', title);
        }

    }))({el:document.body});
/*
|--------------------------------------------------------------------------
|   Don't modify bellow unless you know what you are doing
|--------------------------------------------------------------------------
*/
    //create the cache object for templates
    var JST = window.JST = window.JST || {};

    Backbone.Layout.configure({

        suppressWarnings: true,
        manage: true, // Set all View's to be managed by LayoutManager.

        fetch: function(path) {
            var _compile = function(contents) {
                return (! _.isEmpty(contents) ) ? Handlebars.compile( contents ) : null;
            };

            if (JST[path]) {
                return JST[path];
            }
            // if is starting with # then fetch it from the DOM
            if(! _.isNull(path.match(/^#(.+)$/))) {
                JST[path] =  _compile($(path).html());
                return JST[path];
            }

            path = 'templates/' + path + '.html';
            // To put this method into async-mode, simply call `async` and store the
            // return value (callback function).
            var done = this.async();
            $.get(path, function(contents) {
                JST[path] = _compile(contents);
                done(JST[path]);

            }, 'text');

        },
        render: function(template, context) {
            return template(context);

        }
    });


    // Mix Backbone.Events, and layout management into the app object.
    return _.extend(app, Backbone.Events);

});
