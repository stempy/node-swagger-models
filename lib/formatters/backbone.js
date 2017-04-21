module.exports = function (type, urlRoot, model, scriptModel, scriptValidation) {
    var modelTemplate = [
        '   var Backbone = require("backbone");',
        '   var ' + model.name + ' = Backbone.Model.extend({',
        '       urlRoot: \'' + urlRoot + '\','];
    if (model['x-key'])
        modelTemplate.push('       idAttribute : \'' + model['x-key'].toLowerCase() + '\',');

    modelTemplate = modelTemplate.concat([
        '       defaults: {',
        scriptModel.join('\n'),
        '       },',
        '       validate: function (attrs) {',
        scriptValidation.join('\n'),
        '       }',
        '   });',
        '   module.exports = ' + model.name + ';'
    ]);

    return modelTemplate;
};