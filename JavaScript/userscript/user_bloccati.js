$(document).ready(function() {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function uniqueArray(array, key) {
        var flags = [],
            output = [];
        for (i = 0; i < array.length; i++) {
            if (flags[array[i][key]]) continue;
            flags[array[i][key]] = true;
            output.push(array[i]);
        }
        return output;
    }

    window.FFScript.settings.script107.accounts = uniqueArray(window.FFScript.settings.script107.accounts, 'id');
    if (document.URL.indexOf(document.domain + '/m/') > -1 && $('body').is('#forum')) {
        $.ajax({
            url: '/api.php?f=' + getParameterByName('f') + (getParameterByName('st') !== null ? ('&st=' + getParameterByName('st')) : ''),
            dataType: 'json',
            success: function(r) {
                $.each(window.FFScript.settings.script107.accounts, function(index, item) {
                    if (item['hideTopics']) {
                        r['threads'].forEach(function(e) {
                            if (e.info.start.id.toString() === item['id']) {
                                $('.web a[href="/m/?t=' + e.id + '"]').parent().css({
                                    'display': 'none'
                                }).after('<div class="info st-hidden-topic" style="cursor: pointer; text-align: center; border-radius: 0;">' + window.FFScript.settings.script107.topicMsg + (item['seeAuthor'] ? ' Autore: ' + ('<a href="/m/?act=Profile&MID=' + e.info.start.id + '">' + e.info.start.name + '</a>') : '') + '</div>').siblings(':not(.info)').css({
                                    'display': 'none'
                                });
                            }
                        });
                    }
                });
                $('.st-hidden-topic').click(function() {
                    $(this).fadeOut(500, function() {
                        $(this).siblings().fadeIn(500);
                    });
                });
            }
        });
    } else {
        $.each(window.FFScript.settings.script107.accounts, function(index, item) {
            if (item['hideTopics']) {
                if ($('.xx').length !== 0) {
                    $('.xx').children('a').each(function() {
                        if ($(this).attr('href').split("=")[2] == item['id']) {
                            $(this).parent().css({
                                'display': 'none'
                            }).after(($(this).parent().is('div') ? ('<div class="info st-hidden-topic" style="cursor: pointer; text-align: center; border-radius: 0;">' + window.FFScript.settings.script107.topicMsg + (item['seeAuthor'] ? ' Autore: ' + $(this).prop('outerHTML') : '') + '</div>') : '<td class="info st-hidden-topic" colspan="7" style="cursor: pointer; text-align: center; border-radius: 0;"><div>' + window.FFScript.settings.script107.topicMsg + (item['seeAuthor'] ? ' Autore: ' + $(this).prop('outerHTML') : '') + '</div></td>')).siblings(':not(.info)').css({
                                'display': 'none'
                            });
                        }
                    });
                }
            }
        });
        $('.st-hidden-topic').click(function() {
            $(this).fadeOut(500, function() {
                $(this).siblings().fadeIn(500);
            });
        });
    }

    $.each(window.FFScript.settings.script107.accounts, function(index, item) {
        if ($('.box_m' + item['id']).length !== 0 && !$('body').is('#profile')) {
            item['author'] = ($('.box_m' + item['id']).find('.nick').length !== 0 ? $('.box_m' + item['id']).find('.nick').html() : $('.box_m' + item['id']).children('.details').children('a').prop('outerHTML'));
            $('.box_m' + item['id']).css({
                'display': 'none'
            }).after($('.box_m' + item['id']).is('li') ? '<li class="info st-hidden-post" style="cursor: pointer; text-align: center; border-radius: 0;"><div>' + window.FFScript.settings.script107.postMsg + (item['seeAuthor'] ? (' Autore: ' + item['author']) : '') + '</div></li>' : '<td class="info st-hidden-post" style="cursor: pointer; text-align: center; border-radius: 0;"><div>' + window.FFScript.settings.script107.postMsg + (item['seeAuthor'] ? (' Autore: ' + item['author']) : '') + '</div></td>');
            $('.quote_top').each(function() {
                if ($(this).text().indexOf('(' + $(item['author']).text() + ' @') > -1) {
                    $(this).siblings('.quote').css({
                        'display': 'none'
                    }).after('<div class="quote st-hidden-post" style="text-align: left; cursor: pointer;"><div class="info" style="text-align: center; border-radius: 0;">' + window.FFScript.settings.script107.postMsg + (item['seeAuthor'] ? (' Autore: ' + item['author']) : '') + '</div></div>');
                } else if ($(this).children('mark').length > 0) {
                    if ($(this).text().indexOf('(' + $(item['author']).text()) > -1) {
                        $(this).siblings('.quote').css({
                            'display': 'none'
                        }).after('<div class="quote st-hidden-post" style="text-align: left; cursor: pointer;"><div class="info" style="text-align: center; border-radius: 0;">' + window.FFScript.settings.script107.postMsg + (item['seeAuthor'] ? (' Autore: ' + item['author']) : '') + '</div></div>');
                    }
                }
            });
        }
        if (item['hideTags']) {
            if ($('#tagObject').length !== 0) {
                $('#tagObject').children('li').each(function() {
                    if ($(this).find('a[href*="/?act=Profile&MID="][rel="nofollow"]').attr('href').split("=")[2] == item['id']) {
                        $(this).css({
                            'display': 'none'
                        }).after('<div class="info st-hidden-tags" style="cursor: pointer; text-align: center; border-radius: 0;">' + window.FFScript.settings.script107.tagMsg + (item['seeAuthor'] ? ' Autore: ' + $(this).find('a[href*="/?act=Profile&MID="][rel="nofollow"]').prop('outerHTML') : '') + '</div>')
                    }
                });
            }
        }
    });
    $('.st-hidden-post').click(function() {
        $(this).fadeOut(500, function() {
            $(this).prev().fadeIn(500);
        });
    });
    $('.st-hidden-tags').click(function() {
        $(this).fadeOut(500, function() {
            $(this).prev().fadeIn(500);
        });
    });
});
