chrome.tabs.getSelected(null, function(tab) {
	var domain = tab.url.match(/:\/\/([^\/]+)/)[1];
	chrome.cookies.getAll({url: tab.url}, function(cookies) {
		var i, comment, content = '';
		comment = '<pre>\n'
			+ '# Cookies for domains related to <b>' + escapeForPre(domain) + '</b>.\n'
			+ '# This content may be pasted into a cookies.txt file and used by wget or curl\n'
			+ '# Example:  wget -x <b>--load-cookies cookies.txt</b> ' + escapeForPre(tab.url) + '\n'
			+ '# Example:  curl <b>-b cookies.txt</b> ' + escapeForPre(tab.url) + '\n'
			+ '#\n';
		for (i in cookies) {
			content += cookies[i].domain
				+ '\t'
				+ (!cookies[i].hostOnly).toString().toUpperCase()
				+ '\t'
				+ cookies[i].path
				+ '\t'
				+ cookies[i].secure.toString().toUpperCase()
				+ '\t'
				+ (cookies[i].expirationDate ? cookies[i].expirationDate: '0')
				+ '\t'
				+ cookies[i].name
				+ '\t'
				+ cookies[i].value
				+ '\n';
		}
		document.write(comment + escapeForPre(content) + '</pre>');
	});
});

function escapeForPre(text) {
	return String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
