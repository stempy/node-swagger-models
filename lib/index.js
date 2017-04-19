var swaggerClient = require("swagger-client"),
    util = require("util"),
    Promise = require("bluebird"),
    fs = require("fs"),
    sep = require('path').sep;


var config = {
    fileOutput: null,
    api: null,
    format: 'backbone'
};


function format(type, urlRoot, model, scriptModel, scriptValidation) {
    switch (type) {
        case "backbone":
            return [
                '   var Backbone = require("backbone");',
                '   var ' + model.name + ' = Backbone.Model.extend({',
                '       urlRoot: \'' + urlRoot + '\',',
                '       url: function() {',
                '           return this.urlRoot + \'/\' + this.id;',
                '       },',
                '       defaults: {',
                scriptModel.join('\n'),
                '       },',
                '       validate: function (attrs) {',
                scriptValidation.join('\n'),
                '       }',
                '   });',
                '   module.exports = ' + model.name + ';'
            ];
        default:
            return [
                '   var ' + model.name + ' = {',
                scriptModel.join('\n'),
                '};'
            ];
    }
}

module.exports = function (options) {
    return new Promise(function (resolve, reject) {
        Object.keys(options).forEach(function (k) {
            if (config[k] !== undefined) {
                config[k] = options[k];
            }
        });

        if (!config.api) {
            reject('API Url Endpoint required');
        }

        if (!config.fileOutput) {
            reject('File output path required');
        }
        config.fileOutput = process.cwd() + sep + config.fileOutput;
        if (!fs.existsSync(config.fileOutput)) {
            fs.mkdirSync(config.fileOutput);
        }

        var swagger = new swaggerClient(config.api, {
            success: function () {
                var model,
                    modelName,
                    property,
                    propertyName,
                    scriptModel,
                    scriptValidation;
                if (swagger.ready === true) {
                    for (modelName in swagger.models) {
                        model = swagger.models[modelName].definition;
                        scriptModel = [];
                        scriptValidation = [];
                        for (propertyName in model.properties) {
                            property = model.properties[propertyName];
                            if (scriptModel.length > 0) {
                                scriptModel[scriptModel.length - 1] += ',';
                            }
                            if (property.defaultValue) {
                                property.defaultValue = util.format('\'%s\'', property.defaultValue);
                            }
                            scriptModel.push(util.format('           %s: %s', propertyName, property.defaultValue));
                            if (property.required) {
                                scriptValidation.push.apply(scriptValidation, [
                                    util.format('           if (!attrs.%s) {', property.name),
                                    util.format('               return \'Please fill %s field.\';', property.name),
                                    '           }'
                                ]);
                            }
                        }
                        var modelScript = format(config.format, swagger.basePath, model, scriptModel, scriptValidation);
                        fs.writeFileSync(config.fileOutput + sep + modelName + ".js", modelScript.join('\n'));
                    }
                }
                resolve("Done.");
            },
            failure: function () {
                reject("Swagger API Call failed");
            }
        });
    });
};