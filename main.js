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

		this.addRoute(/^\/$/, function (request) {
			var posts, db = new Blog.DB(this.settings);
			posts = db.getPosts();
			db.close();

			this.renderView('index', request.output, { posts: posts });
		});

		this.addRoute(/^\/new\/?$/, function (request) {
			request.resource = '/new.html';
			return false;
		});

		this.addRoute(/^\/post\/?$/, function (request) {
			this.processPost(request);
		});
	};

	Blog.prototype.processRequest = function (request) {
		if (!this.route(request)) {
			/* Serve static file, if it exists */
			var file = new File(this.getFilePath('/httpdocs' + request.resource));
			if (file.exists()) {
				HTTPServer.serveFile(request, file);
				return;
			}

			this.sendResponseHeaders(404, {}, request.output, 0);
		}
	};


	Blog.prototype.processPost = function (request) {
		var db, data = request.data || {};

		if (/post/i.test(request.method) && data.title && data.message) {
			db = new Blog.DB(this.settings);
			db.addPost(data.title, data.message);
			db.close();
		}

		this.sendResponseHeaders(302, {location: '/'}, request.output, 0);
	};

	HTTPServer.addApplication(Blog);
}());
