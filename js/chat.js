var socket = io();
  $('form').submit(function(){
  	var message_test = $('#m').val();
  	if(message_test != "")
  	{
    	socket.emit('chat message', $('#m').val());
    }
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });