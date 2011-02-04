(function () {
	var Blog = HTTPApplication.extend();

	Blog.prototype.processRequest = function (request, client, input, output) {
		/* Serve static file, if it exists */
		var file = new File(this.getFilePath('/httpdocs' + request.resource));
		if (file.exists()) {
			HTTPServer.serveFile(request, output, file);
			return;
		}

		var message = 'Hello, from blog.';
		this.sendResponseHeaders(200, {'content-type': 'text/html'}, output, message.length);
		output.print(message);
	};

	HTTPServer.addApplication(Blog);
}());
