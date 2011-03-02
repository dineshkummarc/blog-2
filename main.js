(function () {
	this.Blog = HTTPApplication.extend();

	Blog.prototype.init = function () {
		load(this.path + '/lib/database.js');
		this.settings = JSON.parse(readFile(this.path + '/conf/settings.json'));

		if (typeof markdownToHtml === 'undefined') {
			load(this.path + '/httpdocs/js/showdown.js');
			load(this.path + '/httpdocs/js/markdown.js');
		}

		this.addView('index', this.path + '/views/index.jsv');
	};

	Blog.prototype.processRequest = function (request, client, input, output) {
		if (request.resource === '/') {
			var posts, db = new Blog.DB(this.settings);
			posts = db.getPosts();
			db.close();

			this.renderView('index', output, { posts: posts });
			return;
		}

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


	Blog.prototype.processPost = function (request, output) {
		var db, data = request.data || {};

		if (/post/i.test(request.method) && data.title && data.message) {
			db = new Blog.DB(this.settings);
			db.addPost(data.title, data.message);
			db.close();
		}

		this.sendResponseHeaders(302, {location: '/'}, output, 0);
	};

	HTTPServer.addApplication(Blog);
}());
