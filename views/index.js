<html>
<head>
<title>JS Blog</title>
<link rel="stylesheet" type="text/css" href="/style.css"/>
</head>
<body>
<h1>JSBlog - written in JavaScript on both client and server</h1>
<div class="right">
<a href="/new">New Post</a>
</div>
<div class="clear"></div>
<div id="posts"></div>
<? context.posts.forEach(function (post) { ?>
<div class="post">
<h2><? output.print(post.title); ?></h2>
<div><? output.print(post.message); ?></div>
</div>
<? }); ?>
</body>
</html>