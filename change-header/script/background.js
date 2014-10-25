function ModifyHeader(headers, url) {
	var i, o, len, Request = {};

	o = this;
	len = headers.length;

	for (i = 0; i < len; i++) {
		// console.log(headers[i].name + ': ' + headers[i].value);
		if (headers[i].name == 'Referer' &&
			o.inDomain(o.settings.referer.domain, url)) {
			headers[i].value = url;
		}

		if (headers[i].name == 'X-Forwarded-For') {
			headers[i].value = o.randIp();
			o.settings.forwarded.append = false;
		}
	}

	if (o.settings.referer.append) {
		headers[len] = {
			name: 'Referer',
			value: url,
		};
		len++;
	}

	if (o.settings.forwarded.append &&
		o.inDomain(o.settings.forwarded.domain, url)) {
		headers[len] = {
			name: 'X-Forwarded-For',
			value: o.randIp(),
		};
		len++;
	}

	Request.requestHeaders = headers;

	return Request;
}

ModifyHeader.prototype = {
	constructor: ModifyHeader,

	randIp: function() {
		return [
			Math.floor(Math.random() * 225),
			Math.floor(Math.random() * 225),
			Math.floor(Math.random() * 225),
			Math.floor(Math.random() * 225)
		].join('.');
	},

	inDomain: function(reg, url) {
		for (var i in reg) {
			if (reg[i].test(url)) {
				return true;
			}
		}
		return false;
	},

	settings: {
		referer: {
			append: false,
			domain: [
				/http:\/\/pan\.baidu\.com\/.*/
			],
		},
		forwarded: {
			append: true,
			domain: [
				/https?:\/\/www\.re\/.*/,
				/https?:\/\/.+\.pcbeta\.com\/.*/
			],
		},
	},
};

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		// console.log('Request URL:', details.url);
		return new ModifyHeader(details.requestHeaders, details.url);
	},
	{
		urls: [ '<all_urls>' ],
	},
	[
		'requestHeaders',
		'blocking'
	]
);
