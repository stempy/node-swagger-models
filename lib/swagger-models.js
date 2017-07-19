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
        try {
            var format = require("./formatters/" + config.format + ".js");
        } catch (e) {
            format = require("./formatters/vanilla.js");
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
                            var defaultValue;
                            if (property.default === undefined) {
                                switch (property.type) {
                                    case "string":
                                        defaultValue = null;
                                        break;
                                    case "boolean":
                                        defaultValue = false;
                                        break;
                                    case "array":
                                        defaultValue = "[]";
                                        break;
                                    case "integer":
                                        defaultValue = 0;
                                        break;
                                    default:
                                        defaultValue = null;
                                }
                            } else {
                                defaultValue = property.type === "string" ? util.format('\'%s\'', property.default) : property.default;
                            }

                            scriptModel.push(util.format('           %s: %s', propertyName, defaultValue));
                            if (property.required) {
                                scriptValidation.push.apply(scriptValidation, [
                                    util.format('           if (!attrs.%s) {', property.name),
                                    util.format('               return \'Please fill %s field.\';', property.name),
                                    '           }'
                                ]);
                            }
                        }
                        var modelScript = format(config.format, swagger.basePath, model, scriptModel, scriptValidation);
                        fs.writeFileSync(config.fileOutput + sep + modelName.replace(/[\[\],]/g, "").toLowerCase() + ".js", modelScript.join('\n'));
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