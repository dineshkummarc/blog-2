class Blog extends HTTPApplication
	init: ->
		load "#{@path}/lib/database.coffee"
		@settings = JSON.parse readFile "#{@path}/conf/settings.json"

		if !markdownToHtml?
			load "#{@path}/httpdocs/js/showdown.js"
			load "#{@path}/httpdocs/js/markdown.js"

		@addView 'index', 'views/index.jsv'

		@addRoute /^\/$/, (request) ->
			db = new Blog.DB @settings
			posts = db.getPosts()
			db.close()
			@renderView 'index', request, { posts: posts }

		@addRoute /^\/new\/?$/, (request) ->
			request.resource = '/new.html'
			return false

		@addRoute /^\/post\/?$/, (request) ->
			@processPost request

	processRequest: (request) ->
		if !@route request
			/* Serve static file, if it exists */
			@serveRoot request, 'httpdocs'

	processPost: (request) ->
		data = request.data or {}

		if (/post/i.test request.method) and data.title and data.message
			db = new Blog.DB this.settings
			db.addPost data.title, data.message
			db.close()

		@sendResponseHeaders 302, { location: '/' }, request, 0

HTTPServer.addApplication @Blog = Blog
