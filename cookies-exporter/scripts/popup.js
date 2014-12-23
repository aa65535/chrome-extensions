chrome.tabs.getSelected(null, function(tab) {
	var domain = tab.url.match(/:\/\/([^\/]+)/)[1];
	chrome.cookies.getAll({url: tab.url}, function(cookies) {
		var i, comment, content = '';
		comment = '# Cookies for domains related to <b>' + domain + '</b>.\n'
			+ '# This content may be pasted into a cookies.txt file and used by wget or curl\n'
			+ '# Example:  wget -x <b>--load-cookies cookies.txt</b> ' + htmlspecialchars(tab.url) + '\n'
			+ '# Example:  curl <b>-b cookies.txt</b> ' + htmlspecialchars(tab.url) + '\n'
			+ '#\n';
		for (i in cookies) {
			if (!cookies.hasOwnProperty(i)) {
				continue;
			}
			content += [
				cookies[i].domain,
				(!cookies[i].hostOnly).toString().toUpperCase(),
				cookies[i].path,
				cookies[i].secure.toString().toUpperCase(),
				(cookies[i].expirationDate || '0'),
				cookies[i].name,
				cookies[i].value
			].join('\t') + '\n';
		}
		if (!content) {
			document.write('<pre><b>This site has no cookies.</b></pre>');
		} else {
			document.write(
				'<pre>'
				+ comment.replace(
					'cookies.txt',
					'<a href="data:text/plain;base64,'
						+ window.btoa(comment.replace(/<\/?b>/g, '') + content)
						+ '" download="cookies.txt">cookies.txt</a>'
				)
				+ htmlspecialchars(content) + '</pre>'
			);
		}
	});
});

function htmlspecialchars(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
