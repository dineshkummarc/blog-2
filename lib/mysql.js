/* Loads the MySQL JDBC driver dynamically */
(function () {
	var mysql, driver;
	mysql = new File(Blog.path + '/lib/mysql.jar');
	driver = new URLClassLoader([new URL('jar:' + mysql.toURI() + '!/')]).loadClass('com.mysql.jdbc.Driver').newInstance();

	Blog.Database = {};
	Blog.Database.getConnection = function (username, password, database) {
		var props = new java.util.Properties();
		props.setProperty('user', username || '');
		props.setProperty('password', password || '');
		return driver.connect('jdbc:mysql://localhost/' + (database || ''), props);
	};

	Blog.Database.getPosts = function (connection) {
		var result, rs, stmt;
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

		return result;
	};
}());
