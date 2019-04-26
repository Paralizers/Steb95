$(document).ready(function() {
    var selectOptions = '';
    scriptInfo.settings.optionList = window.FFLib.utilities.uniqueItems(scriptInfo.settings.optionList, 'title');
    scriptInfo.settings.optionList.forEach(function (elm) {
        if((elm.adminOnly && (window.FFLib.info.user.isAdmin() || window.FFLib.info.user.isScriptAdmin())) || (elm.customUserId !== '' && elm.customUserId.split(',').indexOf(window.FFLib.info.user.id.toString()) > -1) || (elm.customGroupId !== '' && elm.customGroupId.split(',').indexOf(window.FFLib.info.user.getGroup()) > -1) || (!elm.adminOnly && elm.customUserId === '' && elm.customGroupId === '')) {
            if(elm.title !== '' && elm.value !== '') selectOptions += '<option value="' + window.FFLib.utilities.removeTags(elm.value.replace(/"/g, '&quot;')) + '">' + window.FFLib.utilities.removeTags(elm.title.replace(/"/g, '&quot;')) + '</option>';
        }
    });
    if(selectOptions !== '') {
        var select = '<select class="st-custom-select" style="margin-left:10px;"><option value="" selected>' + scriptInfo.settings.selectTitle + '</option>' + selectOptions + '</select>';
        if(!window.FFLib.info.forum.isFFMobile()) {
            if (window.FFLib.info.forum.isTopic()) $('.fast.send .Item:first-child .left.Sub').append(select);
            else if(window.FFLib.info.forum.isFullEditor()) $('.send .Item:first-child .left.Sub > div').append(select);
            $('select.st-custom-select').addClass('codebuttons');
        }
        else {
            $('label[for="track_topic"]').after(select);
            $('select.st-custom-select').addClass('forminput');
        }
        $('select.st-custom-select').change(function() {
            if($(this).val() !== '') {
                var currentText = $('textarea#Post').val(), startPos = $('textarea#Post').prop("selectionStart");
                $('textarea#Post').val(currentText.substring(0, startPos) + $(this).val() + currentText.substring($('textarea#Post').prop("selectionEnd")));
                $('textarea#Post').focus();
                $('textarea#Post').prop("selectionStart", (startPos + $(this).val().length));
                $('textarea#Post').prop("selectionEnd", (startPos + $(this).val().length));
            }
            $('select.st-custom-select :nth-child(1)').prop('selected', true);
        });
    }
});
