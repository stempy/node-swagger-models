module.exports = function (type, urlRoot, modelName, model, scriptModel, scriptValidation) {
    for(var i=0;i<scriptModel.length;i++){
        var val = scriptModel[i];
        val = val.replace(':','=');
        val = val.replace(',',';');
        val = "    this."+val.trim();
        scriptModel[i]=val;
    }
    
    var modelTypeName = modelName.replace(/[\[\],]/g, "");

    return [
        'function '+modelTypeName + '(model) {',
            scriptModel.join('\n')+';',
            '',
            '    this._refresh(model);',
        '};',
        '',
        modelTypeName+'.prototype._refresh=function(model){',
        '    if (typeof model!=="undefined" && model!==null){',
        '        for (var key in model) {',
        '            if (model.hasOwnProperty(key)) {',
        '                if (typeof model[key]!=="undefined" && model[key]!==null){',
        '                    this[key]=model[key];',
        '                }',
        '            }',
        '        }',
        '    }',
        '};\n'
    ];
};