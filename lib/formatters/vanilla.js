module.exports = function (type, urlRoot, modelName, model, scriptModel, scriptValidation) {
    return [
        '   var ' + modelName.replace(/[\[\],]/g, "") + ' = {',
        scriptModel.join('\n'),
        '};'
    ];
};