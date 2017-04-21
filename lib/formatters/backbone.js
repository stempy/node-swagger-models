module.exports = function (type, urlRoot, model, scriptModel, scriptValidation) {
    return [
        '   var Backbone = require("backbone");',
        '   var ' + model.name + ' = Backbone.Model.extend({',
        '       urlRoot: \'' + urlRoot + '\',',
        '       defaults: {',
        scriptModel.join('\n'),
        '       },',
        '       validate: function (attrs) {',
        scriptValidation.join('\n'),
        '       }',
        '   });',
        '   module.exports = ' + model.name + ';'
    ];
};