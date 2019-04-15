if(typeof(FFBcredits) === "undefined") { FFBcredits = []; } FFBcredits.push({sId: 75752771,sName: "HTML nella lista sezioni",aId: 11674905,aName: "Steb95"});

$(document).ready(function() {
    var obj = null,
        positions = [
            'beforebegin',
            'afterbegin',
            'beforeend',
            'afterend'
        ];
    for(var i = 0, size = scriptInfo.settings.length; i < size; i++) {
        if(scriptInfo.settings[i].where >= 1 && scriptInfo.settings[i].where <= 4) {
            if(scriptInfo.settings[i].id.indexOf('#') === 0) scriptInfo.settings[i].id = scriptInfo.settings[i].id.substr(1);
            if(!isNaN(Number(scriptInfo.settings[i].id))) scriptInfo.settings[i].id = 'f' + scriptInfo.settings[i].id;
            obj = document.getElementById(scriptInfo.settings[i].id);
            if(obj !== null) {
                obj.insertAdjacentHTML(positions[scriptInfo.settings[i].where - 1], scriptInfo.settings[i].html);
                continue;
            }
            if(typeof ff_layout === 'undefined') {
                if(document.body.id === 'board' || document.body.id === 'forum') {
                    obj = document.getElementById(scriptInfo.settings[i].id.replace('c', 'f'));
                    if(obj !== null) {
                        obj = obj.previousElementSibling;
                        obj.insertAdjacentHTML(positions[scriptInfo.settings[i].where - 1], scriptInfo.settings[i].html);
                        continue;
                    }
                }
            }
        }
    }
});
