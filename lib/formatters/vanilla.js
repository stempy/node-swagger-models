module.exports = function (type, urlRoot, model, scriptModel, scriptValidation) {
    return [
        '   var ' + model.name.replace(/[\[\],]/g, "") + ' = {',
        scriptModel.join('\n'),
        '};'
    ];
};