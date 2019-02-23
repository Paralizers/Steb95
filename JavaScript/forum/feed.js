if(typeof(FFBCredits) === "undefined") { FFBCredits = []; } FFBcredits.push({sId: 76344172,sName: "Lettore feed con notifica",aId: 11674905,aName: "Steb95"});

$(document).ready(function() {
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

    function getElementsFromArray(array, key) {
        var output = [];
        array.forEach(function(cur) {
            output.push(cur[key]);
        });
        return output;
    }

    function removeTags(str) {
        return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '').replace('<br />', ' ').replace(/<\/?\w+[^>]*\/?>/g, '').trim();
    };
    scriptInfo.settings.feeds = uniqueArray(scriptInfo.settings.feeds, 'link');
    var links = getElementsFromArray(scriptInfo.settings.feeds, 'link'),
        linkError = '<div class="alert">Feed {number}: il link che hai inserito non &egrave; valido!<br>Se hai bisogno di aiuto apri una nuova discussione nella sezione <a href="https://ffboard.forumfree.it/?f=64397043" target="_blank">Supporto Script</a>.</div>',
        feedError = '<div class="alert">Feed {number}: il link che hai inserito non &egrave; un <u>feed valido</u>!<br>Se hai bisogno di aiuto apri una nuova discussione nella sezione <a href="https://ffboard.forumfree.it/?f=64397043" target="_blank">Supporto Script</a>.</div>',
        defaultCss = ".st-new-items{margin:20px;text-align:left}.st-feed{max-height:300px;box-sizing:border-box;margin:20px 0;padding:0 20px;overflow-y:scroll;text-align:left;list-style-type:none}.st-feed-item{padding:5px 0;position:relative}.st-feed-item:not(:last-child){border-bottom:1px solid #b1afaf}.st-item-desc,.st-item-title{max-width:80%;margin:0}.st-item-title{font-size:1.1em;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.st-item-title a{transition:left .5s;position:relative;left:0}.st-item-title a:hover{left:10px}.st-item-title a:before{content:'\\201C';font-family:arial;font-size:1.5em;position:absolute;left:120px;top:0;opacity:0;transition:all .5s}.st-item-desc,.st-item-time{font-size:.9em}.st-item-title a:hover:before{left:-10px;opacity:1}.st-item-time{position:absolute;right:0;top:calc(50% - 8px)}";
    if (scriptInfo.settings.defaultStyle) $('head').append('<style>' + defaultCss + '</style>');
    $.ajax({
        url: '//ffb.forumfree.net/php/cors_proxy.php',
        type: 'POST',
        data: {
            urls: links,
            mode: "simple"
        },
        cache: false,
        xhrFields: {
            withCredentials: false
        },
        headers: {
            'x-forigin': document.domain
        },
        dataType: 'json',
        success: function(r) {
            var localSt = {},
                ntf = {},
                prevSt = (localStorage.getItem('stFeedScript') === null) ? false : JSON.parse(localStorage.getItem('stFeedScript'));
            scriptInfo.settings.feeds.forEach(function(feedInfo, index) {
                if ($(feedInfo.selector).length !== 0) {
                    if ($.isEmptyObject(r) || typeof r[btoa(feedInfo.link)] == 'undefined' || r[btoa(feedInfo.link)].content === false) {
                        $(feedInfo.selector).append(linkError.replace('{number}', index + 1));
                        return;
                    }
                    try {
                        jQuery.parseXML(r[btoa(feedInfo.link)].content);
                    } catch(error) {
                        $(feedInfo.selector).append(feedError.replace('{number}', index + 1));
                        return;
                    }
                    if ($(jQuery.parseXML(r[btoa(feedInfo.link)].content)).find('entry').length !== 0) {
                        feedInfo.tags = {
                            'href': 'id',
                            'desc': 'summary',
                            'time': 'updated'
                        }
                        feedInfo.items = $(jQuery.parseXML(r[btoa(feedInfo.link)].content)).find('entry').slice(0, feedInfo.number);
                    } else {
                        feedInfo.tags = {
                            'href': 'link',
                            'desc': 'description',
                            'time': 'pubDate'
                        }
                        feedInfo.items = $(jQuery.parseXML(r[btoa(feedInfo.link)].content)).find('item').slice(0, feedInfo.number);
                    }
                    if(feedInfo.items.length === 0) {
                    	$(feedInfo.selector).append(feedError.replace('{number}', index+1));
                        return;
                    }
                    if (feedInfo.notify) {
                        localSt[feedInfo.link] = getLatestDate($(feedInfo.items).find(feedInfo.tags.time));
                        ntf[feedInfo.link] = (prevSt === false || typeof prevSt[feedInfo.link] == 'undefined') ? feedInfo.items.length : notifyCounter(feedInfo, prevSt[feedInfo.link]);
                    }
                    $(feedInfo.selector).append(feedObject(feedInfo, ntf[feedInfo.link], index + 1));
                }
            });
            if (!jQuery.isEmptyObject(localSt) && JSON.stringify(localSt) !== localStorage.getItem('stFeedScript')) {
                localStorage.setItem('stFeedScript', JSON.stringify(localSt));
            };

            function getLatestDate(times) {
            	var date = '', latest = 0;
                times.each(function(){
                	date = new Date($(this).text());
                    date = date.getTime()/1000;
                    if(isNaN(date) === false && date > latest) latest = date;
                });
                return latest;
            }
            
            function notifyCounter(feedInfo, prevDate) {
                var ntf = 0,
                    d;
                feedInfo.items.each(function() {
                    if ($(this).find(feedInfo.tags.time).length === 0) return;
                    d = new Date($(this).find(feedInfo.tags.time).text());
                    if ((d.getTime() / 1000) > prevDate) ntf++;
                });
                return ntf;
            }

            function feedObject(feedInfo, ntf, feedNum) {
                var d='', feedHtml = (typeof ntf != 'undefined' ? '<div class="st-new-items st-feed-' + feedNum + '">' + ntf + ' ' + scriptInfo.settings.notifyMsg + '</div>' : '') + '<div class="st-feed-object st-feed-' + feedNum + '"><ul class="st-feed">';
                feedInfo.items.each(function() {
                    if (feedInfo.date && $(this).find(feedInfo.tags.time).length > 0) {
                        d = new Date($(this).find(feedInfo.tags.time).text());
                        d = '<div class="st-item-time">' + fromTimeToDate(d.getTime()) + '</div>';
                    }
                    feedHtml += '<li class="st-feed-item"><div class="st-item-title"><a href="' + removeTags($(this).find(feedInfo.tags.href).text()) + '" target="_blank">' + removeTags($(this).find('title').text()) + '</a></div>' + d + (feedInfo.description && $(this).find(feedInfo.tags.desc).length > 0 ? '<div class="st-item-desc">' + removeTags($(this).find(feedInfo.tags.desc).text()) + '</div>' : '') + (feedInfo.optionals.length > 0 ? optionalParameters($(this), feedInfo.optionals) : '') + '</li>';
                });
                feedHtml += '</ul></div>';
                return feedHtml;
            }

            function fromTimeToDate(time) {
                var date = new Date(time),
                    y = date.getFullYear(),
                    m = date.getMonth() + 1,
                    d = date.getDate(),
                    h = date.getHours(),
                    mi = date.getMinutes();
                if (m < 10) m = '0' + m;
                if (d < 10) d = '0' + d;
                if (h < 10) h = '0' + h;
                if (mi < 10) mi = '0' + mi;
                return [d, m, y].join('-') + ' ' + [h, mi].join(':');
            }

            function optionalParameters(item, optionals) {
                var out = '';
                optionals.forEach(function(cur, i) {
                    cur = cur.replace(':', '\\:');
                    if (item.find(cur).length > 0) {
                        out += '<div class="optional optional-' + (i + 1) + '">' + item.find(cur).map(function() {
                            return removeTags($(this).text())
                        }).get().join(', ') + '</div>';
                    }
                });
                return out;
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('[st-feed] Errore (' + errorThrown + ')!');
        }
    });
});
