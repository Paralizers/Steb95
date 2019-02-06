if (typeof FFBcredits === "undefined") {FFBcredits = [];} if(document.querySelector('script[src="//ffb.forumfree.net/js/credits.js"]') == null) {var a = document.createElement("script");a.setAttribute("type", "text/javascript");a.setAttribute("src", "//ffb.forumfree.net/js/credits.js");document.getElementsByTagName("head")[0].appendChild(a);}FFBcredits.push({sId: 75752771,sName: "HTML nella lista sezioni",aId: 11674905,aName: "Steb95"});

$(document).ready(function() {
    var obj = null,
        positions = [
            'beforebegin',
            'afterbegin',
            'beforeend',
            'afterend'
        ];
    for (var i = 0, size = window.FFScriptSettings.script16.length; i < size; i++) {
        if (window.FFScriptSettings.script16[i].where >= 1 && window.FFScriptSettings.script16[i].where <= 4) {
            if (!isNaN(Number(window.FFScriptSettings.script16[i].id))) {
                window.FFScriptSettings.script16[i].id = 'f' + window.FFScriptSettings.script16[i].id;
            }
            obj = document.getElementById(window.FFScriptSettings.script16[i].id);
            if (obj !== null) {
                obj.insertAdjacentHTML(positions[window.FFScriptSettings.script16[i].where - 1], window.FFScriptSettings.script16[i].html)
            } else {
                obj = document.getElementsByClassName(window.FFScriptSettings.script16[i].id)[0];
                if (typeof obj !== "undefined") {
                    obj = obj.previousElementSibling;
                    while (!obj.classList.contains('group-section')) {
                        obj = obj.previousElementSibling;
                    }
                    obj.insertAdjacentHTML(positions[window.FFScriptSettings.script16[i].where - 1], window.FFScriptSettings.script16[i].html)
                } else {
					console.log("L'id "+window.FFScriptSettings.script16[i].id+" non è stato trovato.");
				}
            }
        }
    }
});
