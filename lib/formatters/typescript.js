module.exports = function (type, urlRoot, modelName, model, scriptModel, scriptValidation,scriptObjectModel) {
    for(var i=0;i<scriptObjectModel.length;i++){
        var objModel = scriptObjectModel[i];
        // name/val/type
        var name=objModel.name;
        var val=objModel.val;
        var oType=objModel["type"];

        // ts type
        switch(oType){
            case "string":
                break;
            case "boolean":
                break;
            case "array":
                break;
            case "integer":
                oType = "number";
                break;
            default:
                oType = "any";
                break;
        }

        scriptModel[i]=`        ${name}:${oType};`;
    }
    
    var modelTypeName=modelName.replace(/[\[\],]/g, "");

    return [
        'class '+modelTypeName+ ' {',
            scriptModel.join('\n')+';',
        '',
        '    constructor(obj?:any){',
        '       if (typeof obj!=="undefined" && obj!==null){',
        '           for (var key in obj) {',
        '               if (obj.hasOwnProperty(key)) {',
        '                   if (typeof obj[key]!=="undefined" && obj[key]!==null){',
        '                       (this as any)[key]=obj[key];',
        '                   }',
        '               }',
        '           }',
        '       }',
        '    }',
        '};'
    ];
};