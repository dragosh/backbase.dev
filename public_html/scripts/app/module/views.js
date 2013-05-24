define([
	'app',
	'backbone',
	'module/models' // get the models
],

function(app, Backbone, Models) {

    'use strict';
	var Views = {};
/*
|--------------------------------------------------------------------------
| Header nothing fancy
*/
    Views.Header = Backbone.View.extend({
        className: 'wrapper',
        template: 'partials/header',
        events: {
            'click #reloadFeed' : 'triggerReload'
        },
        serialize: function(){
            return {
                title: this.collection.title,
                description: this.collection.description
            };
        },
        triggerReload:  function(){
            this.collection.fetch();
        }
    });
/*
|--------------------------------------------------------------------------
| Sidebar main view
*/
    Views.Sidebar = Backbone.View.extend({
        className: 'wrapper',
        template: 'partials/sidebar',
        events: {
            // no events for now probably the navigation
        },
        initialize: function(options) {

            this.on('afterRender', function() {
                this.$('#itemsNav').find('li').eq(options.selectedTab)
                    .addClass('selected').siblings().removeClass('selected');
            }, this);

            // show the preloader when fetching new data
            this.collection.on('request', function(){
                this.$('.preloader').show();
                this.$('#itemsBucket').addClass('fetching');
            },this).on('sync', function() {
                this.$('.preloader').hide();
                this.$('#itemsBucket').removeClass('fetching');
            },this);

            this.setViews({
                '#itemsBucket': new Views.SidebarList({collection:this.collection})
            });
        }
    });
/*
|--------------------------------------------------------------------------
|  Sidebar list view
*/
    Views.SidebarList = Backbone.View.extend({
        tagName: 'ul',
        className: 'items-list',
        initialize: function( ){
            this.addAll();
            this.collection.on('reset', this.render,this);
            this.collection.on('add', this.addOne,this);
        },
        afterRender: function(){
            $('#itemsBucket').find('li:first').addClass('selected');
        },
        addAll: function() {

            this.collection.forEach(function(model) {
                this.addOne(model);
            },this);
        },
        addOne: function(model) {
            this.insertView(new Views.SidebarItem({model:model})).render();
        }

    });
/*
|--------------------------------------------------------------------------
| Single item list
*/
    Views.SidebarItem = Backbone.View.extend({
        tagName:'li',
        className:'item',
        template: '#mediaItemList-template', // check the inline template in index.html
        events:{
            'click': 'select',
        },
        serialize: function() {
            return this.model.toJSON();
        },
        initialize: function() {
            this.$el.attr( 'data-url', this.model.get('link'));
        },
        // selecting an item
        select: function(ev) {
            if(app.selectedItem !== this.model) {
                app.selectedItem = this.model;
                app.trigger('item:selected',app.selectedItem);

            }
        }

    });
/*
|--------------------------------------------------------------------------
| Global Content News Page
*/
    Views.NewsPage = Backbone.Layout.extend({
        className: 'page',
        template: 'pages/news',
        events: {

        },
        serialize : function(){
            return {
                item: app.selectedItem.toJSON()
            };
        },
        initialize: function() {
            //if they are data in collection select the first item and render the content
            if(this.collection.length > 0) {
                app.selectedItem = this.collection.at(0);
                this.insertView('#itemObject',new Views.NewsDetail({model: app.selectedItem}));
                app.trigger('item:selected',app.selectedItem);
            } else {
                app.trigger('items:empty');
            }

        }
    });
/*
|--------------------------------------------------------------------------
| Single Item Content Page
*/
    Views.NewsDetail = Backbone.Layout.extend({
        className: 'wrapper',
        template: 'partials/news-item',
        events: {

        },
        serialize: function() {
            return app.selectedItem.toJSON();
        },
        initialize: function() {
            app.off('item:selected')
                .on('item:selected',function(model){
                var dataUrl = model.get('link');
                $('#itemsBucket')
                    .find('li.item[data-url="'+ dataUrl +'"]')
                    .addClass('selected')
                    .siblings().removeClass('selected');

                this.render();

            },this);
        },
        afterRender: function() {
            //probably some nice plugins here or video content or whatever

        },
        //preload the images
        preload: function() {
            // show progess bar
            if(_.isFunction( $.fn.imagesLoaded ) ) {
                this.$('.preloader').show();
                this.$('.content').hide();
                var that = this;
                this.$el.imagesLoaded({
                    callback: function(){
                       that.$('.preloader').fadeOut();
                       that.$('.content').fadeIn();
                    },
                    progress: function (isBroken, $images, $proper, $broken) {
                       //progress bar here if needed
                    }
                });

            }
        }
    });
/*
|--------------------------------------------------------------------------
| Footer Empty for now
*/
    Views.Footer = Backbone.Layout.extend({
        template: 'partials/footer'
    });

	return Views;
});
