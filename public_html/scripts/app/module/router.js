define([
    'app',
    'module/models',
    'module/views'
],
function(app, Models, Views) {

    'use strict';
/*
|--------------------------------------------------------------------------
| Begin Base Router
*/
    var Router = Backbone.Router.extend({

        routes: {
            '': 'index',
            'pipe-(:pipe)(/)': 'pipe', // not done
            '*other': 'index' // 404 page
        },
        before: {
            // in case of some router filtering
        },

        initialize: function(bootstrap) {
            // get the views and put them in the layout
            var views = {
                'header' : new Views.Header({ collection: app.newsCollection }),
                'aside'  : new Views.Sidebar({ collection: app.newsCollection, selectedTab:0 }),
                'footer' : new Views.Footer(),
                '#pages' : new Views.NewsPage({ collection: app.newsCollection })
            };

            var layoutOptions = {
                el: '#container',
                template: 'layouts/default',
                beforeRender: function(){
                    app.trigger('layout:beforeRender');
                },
                afterRender: function() {
                    app.trigger('layout:afterRender');
                },
                views: views
            };
            app.layout = app.useLayout(layoutOptions);
        },

        index: function() {
            app.layout.render();
        },

        pipe: function(by) {

            //TODO by

        },
        //small helper
        _goto_: function() {
            return this.navigate(_.toArray(arguments).join('/'), true);
        }
    });

    return Router;

});
