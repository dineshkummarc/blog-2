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
			load(this.path + '/httpdocs/js/markdown.js');
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

		if (/^\/posts.json$/.test(request.resource)) {
			this.serveJSON(output);
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

	Blog.prototype.serveJSON = function (output) {
		var result, rs, stmt, connection = this.getDBConnection();
		stmt = connection.prepareStatement('SELECT title, html, `date` FROM posts ORDER BY `date` DESC');
		rs = stmt.executeQuery();
		result = [];
		
		while (rs.next()) {
			result.push({
				title: ('' + rs.getString(1)),
				message: ('' + rs.getString(2)),
				date: ('' + rs.getString(3))
			});
		}
		connection.close();

		result = JSON.stringify(result);
		this.sendResponseHeaders(200, {'content-type': 'application/json'}, output, result.length);
		output.print(result);
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
