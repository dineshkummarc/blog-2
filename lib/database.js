Blog.DB = function (settings) {
	this.connection = MySQL.getConnection(settings.db.username || 'root', settings.db.password || '', settings.db.database || '');
};

Blog.DB.prototype.getPosts = function () {
	var result, rs, stmt;
	stmt = this.connection.prepareStatement('SELECT title, html, `date` FROM posts ORDER BY `date` DESC');
	rs = stmt.executeQuery();
	result = [];
	
	while (rs.next()) {
		result.push({
			title: ('' + rs.getString(1)),
			message: ('' + rs.getString(2)),
			date: ('' + rs.getString(3))
		});
	}

	return result;
};

Blog.DB.prototype.addPost = function (title, message) {
	var stmt = this.connection.prepareStatement('INSERT INTO posts (`title`, `markdown`, `html`) VALUES(?, ?, ?)');
	stmt.setString(1, title);
	stmt.setString(2, message);
	stmt.setString(3, markdownToHtml(message));
	stmt.executeUpdate();
};

Blog.DB.prototype.close = function () {
	this.connection.close();
};
