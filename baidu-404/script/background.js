function modifyHeader(headers, url) {
    var i, len, reg, Request = {};

    reg = /https?:\/\/.*\.baidu\.com\/.*/;

    if (reg.test(url)) {
        len = headers.length;

        for (i = 0; i < len; i++) {
            if (headers[i].name == 'Referer') {
                if (!reg.test(headers[i].value)) {
                    headers[i].value = url;
                }
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
