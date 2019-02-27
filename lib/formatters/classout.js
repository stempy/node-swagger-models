module.exports = function (type, urlRoot, modelName, model, scriptModel, scriptValidation) {
    return [
        'class '+modelName.replace(/[\[\],]/g, "") + ' {',
            scriptModel.join('\n'),

            'constructor(o){',
                'if (typeof obj!=="undefined" && obj!==null){',
                    'for (var key in obj) {',
                        'if (obj.hasOwnProperty(key)) {',
                            'if (typeof obj[key]!=="undefined" && obj[key]!==null){',
                                'this[key]=obj[key];',
                            '}',
                        '}',
                    '}',
                '}',
            '}',
        '};'
    ];
};