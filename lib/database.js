importPackage(java.sql);
importPackage(java.io);
importPackage(java.net);
importPackage(java.util);


var mysql = new File('lib/mysql.jar');
var driver = new URLClassLoader([new URL('jar:' + mysql.toURI() + '!/')]).loadClass('com.mysql.jdbc.Driver');

var props = new Properties();
props.setProperty('user', 'root');
props.setProperty('password', '');
var conn = driver.newInstance().connect('jdbc:mysql://localhost/', props);
print(conn);
