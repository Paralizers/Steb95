if(typeof(FFBCredits) === "undefined") { FFBCredits = []; } FFBcredits.push({sId: 75752771,sName: "HTML nella lista sezioni",aId: 11674905,aName: "Steb95"});

$(document).ready(function() {
    var obj = null,
        positions = [
            'beforebegin',
            'afterbegin',
            'beforeend',
            'afterend'
        ];
    for (var i = 0, size = scriptInfo.settings.length; i < size; i++) {
        if (scriptInfo.settings[i].where >= 1 && scriptInfo.settings[i].where <= 4) {
            if (!isNaN(Number(scriptInfo.settings[i].id))) {
                scriptInfo.settings[i].id = 'f' + scriptInfo.settings[i].id;
            }
            obj = document.getElementById(scriptInfo.settings[i].id);
            if (obj !== null) {
                obj.insertAdjacentHTML(positions[scriptInfo.settings[i].where - 1], scriptInfo.settings[i].html)
            } else {
                obj = document.getElementsByClassName(scriptInfo.settings[i].id)[0];
                if (typeof obj !== "undefined") {
                    obj = obj.previousElementSibling;
                    while (!obj.classList.contains('group-section')) {
                        obj = obj.previousElementSibling;
                    }
                    obj.insertAdjacentHTML(positions[scriptInfo.settings[i].where - 1], scriptInfo.settings[i].html)
                } else {
					console.log("L'id "+scriptInfo.settings[i].id+" non è stato trovato.");
				}
            }
        }
    }
});
