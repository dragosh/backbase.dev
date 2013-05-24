/*
|--------------------------------------------------------------------------
|   Put here handlebars helpers
*/

require([
  "handlebars"  //require handlebars
],

function(Handlebars) {

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        //console.log(v1, operator,v2,options);
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
                break;
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
                break;
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
                break;
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                break;
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
                break;
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                break;
            default:
                return options.inverse(this);
                break;
        }
    })

});
