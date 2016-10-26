const Handlebars = require('handlebars');
const marked = require('marked');


module.exports = () => {
  Handlebars.registerHelper('m', function(text, options) {
    return options.fn ? marked(options.fn()) : marked(text);
  });

  Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error('Handlerbars Helper \'compare\' needs 2 parameters');

    var operator = options.hash.operator || '==';

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    };

    if (!operators[operator])
        throw new Error('Handlerbars Helper \'compare\' doesn\'t know the operator '+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});
};