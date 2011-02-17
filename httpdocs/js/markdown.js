(function () {
	var converter = new Showdown.converter();
	this.markdownToHtml = function (input) {
		var text = input.replace(/</g, '&lt;');

		// allow basic html
		text = text.replace(/&lt;\s*(\/)?(table|td|tr|tbody|thead|th|b|i|strong|u|strike|del|kbd|code|address)(?:\b|>).*?>/ig, '<$1$2>');
		
		// allow escaping of <
		text = text.replace(/\\(<|&lt;)/g, '&lt;');
		
		// force markdown to process inside tables
		text = text.replace(/<(td|th)>([^<]+)(<\/\1>)/ig, function (a, b, c, d) {
			return ['<', b, '>', converter.makeHtml(c), d].join('');
		});
		
		return converter.makeHtml(text);
	};
}());
