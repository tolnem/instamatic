$(function() {
    var clientID = 'CONFIGURE_THIS_OR_IT_WONT_WORK',
    tag = 'tedxcph',
    loadTimeout = 30000, // 30 seconds
    animTimeout = 10000, // 10 seconds
    relayoutTimeout = 500,
    cutOff = 30;

    var minTag, nextUrl, loadTimeoutId, baseUrl,
        initedIsotope = false;
    
    var setBaseUrl = function() {
        baseUrl = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=' + clientID;
    };
    
    var doRelayout = function() {
        loadTimeoutId = undefined;
        $('#instamatic li:gt('+ (cutOff - 1) +')').remove();
        $('#instamatic')
        .isotope('reloadItems')
        .isotope({sortBy: 'original-order'});
    };
    
    var setupRelayout = function() {
        if (loadTimeoutId) {
            window.clearTimeout(loadTimeoutId);
        }
        loadTimeoutId = window.setTimeout(doRelayout, relayoutTimeout);
    }
    
    var onImageLoad = function() {
        $(this).parents('li').prependTo('#instamatic');
        
        if (!initedIsotope) {
            $('#instamatic').isotope({
              itemSelector : '#instamatic li',
              layoutMode : 'masonry',
              masonry: {
                  columnWidth: 160,
                  rowHeight: 160
              }
            });
            initedIsotope = true;
        }
        setupRelayout();
    };
    
    var setSize = function(elem) {
        var width, height,
            rand = Math.random() * 100,
            $elem = $(elem);
        if (!$elem.is('img')) {
            $elem = $elem.find('img');
        }
        if (rand > 96) {
            width = 465;
            height = 465;
        } else if (rand > 80) {
            width = 310;
            height = 310;
        } else {
            width = 155;
            height = 155;
        }
        $elem.attr('width', width).attr('height', height);
    };
    
    var loadItems = function(loadNext) {
        var url = baseUrl;
        if (loadNext) {
            if (!nextUrl) {
                return;
            }
            url = nextUrl;
        } else if (minTag) {
            url = baseUrl + '&min_tag_id=' + minTag;
        }
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function(response) {
                var num, entry, code, image;
                if (response && response.hasOwnProperty('data')) {
                    if (response.pagination.min_tag_id && (!minTag || response.pagination.min_tag_id > minTag)) {
                        minTag = response.pagination.min_tag_id;
                    }
                    if (response.pagination.next_min_id) {
                        nextUrl = response.pagination.next_url;
                    }
                    for (num in response.data) {
                        if (response.data.hasOwnProperty(num)) {
                            entry = response.data[num];
                            image = entry.images.standard_resolution;
                            code = '<li><a href="'+entry.link+'"><img src="' + image.url + '"></a></li>';
                            setSize($(code)
                                .find('img')
                                    .bind('load', onImageLoad)
                                .end()
                                .prependTo('#loading'));
                        }
                    }
                }
                if ($('#instamatic li, #loading li').size() < (cutOff - 5)) {
                    loadItems(true);
                }
            }
        });
    };

    var reorder = function (parent) {
        var children = $(parent).children();
        var num = children.length;

        var temp, one, other;
        for (one = 0; one < num; one++) {
            temp = children[one];
            other = Math.floor(Math.random() * num);
            children[one] = children[other];
            children[other] = temp;
        }
        $(children).remove();
        $(parent).append($(children));
    };
    
    var animate = function() {
        $('#instamatic li').each(function(idx, elem) {
            setSize(elem);
        });
        reorder('#instamatic');
        setupRelayout();
    };

    if (window.location.search) {
        tag = window.location.search.substr(1);
    }
    setBaseUrl();
    
    window.setInterval(loadItems, loadTimeout);
    loadItems();

    window.setInterval(animate, animTimeout);
});
