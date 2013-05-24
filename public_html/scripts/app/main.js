require([
    'app', //main app
    'module/router', //main router
    'module/config', //config
    'module/models' //models
],

function(app, Router, Config, Models) {

/*
|--------------------------------------------------------------------------
|  get some data first to play with;
*/
    'use strict';

    app.newsCollection = new Models.NewsCollection();
    app.newsCollection.fetch().always(function(){
            $('#loader').hide();
        }).done(function(response) {
            app.newsCollection.count = response.count;
            app.newsCollection.title = response.value.title;
            app.newsCollection.description = response.value.description;
            app.newsCollection.add(response.value.items);

            app.start(Router);
    });
});
