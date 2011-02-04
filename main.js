(function () {
	this.Blog = HTTPApplication.extend();

	Blog.prototype.init = function () {
		Blog.libPath = this.path + '/lib';
		if (!Blog.Database) {
			load(this.path + '/lib/database.js');
			print(Blog.MySQL.getConnection('root'));
		}
	};

	Blog.prototype.processRequest = function (request, client, input, output) {
		request.resource = request.resource === '/' && '/index.html' || request.resource;

		/* Serve static file, if it exists */
		var file = new File(this.getFilePath('/httpdocs' + request.resource));
		if (file.exists()) {
			HTTPServer.serveFile(request, output, file);
			return;
		}

		this.sendResponseHeaders(404, {}, output, 0);
	};

	HTTPServer.addApplication(Blog);
}());
