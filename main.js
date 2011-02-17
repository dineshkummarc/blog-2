(function () {
	this.Blog = HTTPApplication.extend();

	Blog.prototype.init = function () {
		Blog.path = this.path;
		this.settings = JSON.parse(readFile(this.path + '/conf/settings.json'));

		if (!Blog.Database) {
			load(this.path + '/lib/database.js');
			print(Blog.MySQL.getConnection(this.settings.db.username, this.settings.db.password, this.settings.db.database));
		}
	};

	Blog.prototype.processRequest = function (request, client, input, output) {
		request.resource = request.resource === '/' && '/index.html' || request.resource;

		if (/^\/new\/?$/.test(request.resource)) {
			request.resource = '/new.html';
		}

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
