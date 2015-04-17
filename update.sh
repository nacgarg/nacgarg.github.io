VERSION = 1

if [`curl "http://ngargi.me/update"` -eq $VERSION];
	then
		echo 'no update needed';
fi;