(function () {
	var Blog = HTTPApplication.extend();

	Blog.prototype.processRequest = function (request, client, input, output) {
		var message = 'Hello, from blog.';
		this.sendResponseHeaders(200, {'content-type': 'text/html'}, output, message.length);
		output.print(message);
	};

	HTTPServer.addApplication(LocalServer);
}());
