module.exports = function (type, urlRoot, modelName, model, scriptModel, scriptValidation) {
    for(var i=0;i<scriptModel.length;i++){
        var val = scriptModel[i];
        val = val.replace(':','=');
        val = val.replace(',',';');
        scriptModel[i]=val;
    }
    
    return [
        'class '+modelName.replace(/[\[\],]/g, "") + ' {',
            scriptModel.join('\n')+';',

            '\n constructor(obj){',
            '       if (typeof obj!=="undefined" && obj!==null){',
            '           for (var key in obj) {',
            '               if (obj.hasOwnProperty(key)) {',
            '                   if (typeof obj[key]!=="undefined" && obj[key]!==null){',
            '                       this[key]=obj[key];',
            '                   }',
            '               }',
            '           }',
            '       }',
            ' }',
        '};'
    ];
};