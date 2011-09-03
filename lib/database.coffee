throw new Error 'Blog requires the espresso-mysql extension' if !MySQL?

class Blog.DB
	constructor: (settings) ->
		@connection = MySQL.getConnection(
			settings.db.username or 'root',
			settings.db.password or '',
			settings.db.database or ''
		)

	getPosts: ->
		stmt = @connection.prepareStatement(
			'SELECT title, html, `date` FROM posts ORDER BY `date` DESC'
		)
		rs = stmt.executeQuery()

		(title: "#{rs.getString 1}"
		message: "#{rs.getString 2}"
		date: "#{rs.getString 3}") while rs.next()

	addPost: (title, message) ->
		stmt = @connection.prepareStatement(
			'INSERT INTO posts (`title`, `markdown`, `html`) VALUES(?, ?, ?)'
		)

		stmt.setString 1, title
		stmt.setString 2, message
		stmt.setString 3, markdownToHtml message
		stmt.executeUpdate()

	close: ->
		@connection.close()
