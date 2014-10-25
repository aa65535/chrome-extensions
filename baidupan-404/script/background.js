function modifyHeader(headers, url) {
    var i, len, reg, Request = {};

    reg = /http:\/\/pan\.baidu\.com\/.*/;

    if (reg.test(url)) {
        len = headers.length;

        for (i = 0; i < len; i++) {
            if (headers[i].name == 'Referer') {
                headers[i].value = url;
                break;
            }
        }
    }

    Request.requestHeaders = headers;

    return Request;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        return modifyHeader(details.requestHeaders, details.url);
    },
    {
        urls: [ '<all_urls>' ],
    },
    [
        'requestHeaders',
        'blocking'
    ]
);
