function ModifyHeader(headers, url) {
	var i, o, reg, len, Request = {};

	o = this;
	len = headers.length;

	for (i = 0; i < len; i++) {
		// console.log(headers[i].name + ': ' + headers[i].value);
		if (headers[i].name == 'Referer') {
			reg = o.indexOf(o.settings.referer.domain, url);
			if (reg && !reg.test(headers[i].value)) {
				headers[i].value = url;
			}
		}

		if (headers[i].name == 'X-Forwarded-For') {
			headers[i].value = o.randIp();
			o.settings.forwarded.append = false;
		}
	}

	if (o.settings.referer.append) {
		headers[len] = {
			name: 'Referer',
			value: (new URL(url)).origin,
		};
		len++;
	}

	if (o.settings.forwarded.append &&
		o.indexOf(o.settings.forwarded.domain, url)) {
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

	indexOf: function(reg, url) {
		for (var i in reg) {
			if (reg[i].test(url)) {
				return reg[i];
			}
		}
		return null;
	},

	settings: {
		referer: {
			append: false,
			domain: [
				/https?:\/\/.*\.baidu\.com\/.*/
			],
		},
		forwarded: {
			append: true,
			domain: [
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
