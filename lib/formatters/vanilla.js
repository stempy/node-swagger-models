module.exports = function (type, urlRoot, model, scriptModel, scriptValidation) {
            return [
                '   var ' + model.name + ' = {',
                scriptModel.join('\n'),
                '};'
            ];
};