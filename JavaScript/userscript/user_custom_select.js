$(document).ready(function() {
    var selectOptions = '';
    scriptInfo.settings.optionList = window.FFLib.utilities.uniqueItems(scriptInfo.settings.optionList, 'title');
    scriptInfo.settings.optionList.forEach(function (elm) {
        if(elm.title !== '' && elm.value !== '') selectOptions += '<option value="' + elm.value.replace(/"/g, '&quot;') + '">' + elm.title.replace(/"/g, '&quot;') + '</option>';
    });
    if(selectOptions !== '') {
        var select = '<select class="st-user-custom-select" style="margin-left:10px;"><option value="" selected>' + scriptInfo.settings.selectTitle + '</option>' + selectOptions + '</select>';
        if(!window.FFLib.info.forum.isFFMobile()) {
            if(window.FFLib.info.forum.isQuirks()) {
                if(window.FFLib.info.forum.isTopic()) $('form[name="REPLIER"] input[name="SPOILER"]').parent('div').append(select);
                else if(window.FFLib.info.forum.isFullEditor()) $('form[name="REPLIER"] select[name="FONT"]').parent('div').append(select);
            }
            else {
                if(window.FFLib.info.forum.isTopic()) $('.fast.send .Item:first-child .left.Sub').append(select);
                else if(window.FFLib.info.forum.isFullEditor()) $('.send .Item:first-child .left.Sub > div').append(select);
            }
            $('select.st-user-custom-select').addClass('codebuttons');
        }
        else {
            $('label[for="track_topic"]').after(select);
            $('select.st-user-custom-select').addClass('forminput');
        }
        $('select.st-user-custom-select').change(function() {
            if($(this).val() !== '') {
                var currentText = $('textarea#Post').val(), startPos = $('textarea#Post').prop("selectionStart");
                $('textarea#Post').val(currentText.substring(0, startPos) + $(this).val() + currentText.substring($('textarea#Post').prop("selectionEnd")));
                $('textarea#Post').focus();
                $('textarea#Post').prop("selectionStart", (startPos + $(this).val().length));
                $('textarea#Post').prop("selectionEnd", (startPos + $(this).val().length));
            }
            $('select.st-user-custom-select :nth-child(1)').prop('selected', true);
        });
    }
});
