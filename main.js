(function () {
	this.Blog = HTTPApplication.extend();

	Blog.prototype.init = function () {
		Blog.path = this.path;
		this.settings = JSON.parse(readFile(this.path + '/conf/settings.json'));

		if (!Blog.Database) {
			load(this.path + '/lib/database.js');
		}

		if (typeof markdownToHtml === 'undefined') {
			load(this.path + '/httpdocs/js/showdown.js');
			load(this.path + '/httpdocs/js/markdownToHtml.js');
		}
	};

	Blog.prototype.processRequest = function (request, client, input, output) {
		request.resource = request.resource === '/' && '/index.html' || request.resource;

		if (/^\/new\/?$/.test(request.resource)) {
			request.resource = '/new.html';
		}

		if (/^\/post\/?$/.test(request.resource)) {
			this.processPost(request, output);
			return;
		}

		/* Serve static file, if it exists */
		var file = new File(this.getFilePath('/httpdocs' + request.resource));
		if (file.exists()) {
			HTTPServer.serveFile(request, output, file);
			return;
		}

		this.sendResponseHeaders(404, {}, output, 0);
	};

	Blog.prototype.getDBConnection = function () {
		return Blog.MySQL.getConnection(this.settings.db.username, this.settings.db.password, this.settings.db.database);
	};

	Blog.prototype.processPost = function (request, output) {
		var connection, stmt, data = request.data || {};
		if (/post/i.test(request.method) && data.title && data.message) {
			connection = this.getDBConnection();
			stmt = connection.prepareStatement('INSERT INTO posts (`title`, `markdown`, `html`) VALUES(?, ?, ?)');
			stmt.setString(1, data.title);
			stmt.setString(2, data.message);
			stmt.setString(3, markdownToHtml(data.message));
			stmt.executeUpdate();
			stmt.close();
		}
		this.sendResponseHeaders(302, {location: '/'}, output, 0);
	};

	HTTPServer.addApplication(Blog);
}());
