$(document).ready(function () {
    var socket = io();

    socket.on('connect', function () {
        var room = 'global room';
        var name = $("#name-user").val();
        var img = $("#name-image").val();
        socket.emit('global room', {
            room: room,
            name: name,
            img: img
        });
    });
    socket.on('loggedInUser', function(users){
        var friends = $('.friend').text();
        var friend = friends.split('@');
        var name = $("#name-user").val();
        var ol= $("<ol></ol>");
        var arr = [];   
        for (var i=0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                var list = '<img src="https://placehold.it/300x300" class="pull-left img-circle" style="width: 40px; margin-right: 7px" /><p>' + 
                            '<a href="/chat"><h3 style="padding-top:15px;color:gray;font-size:14px;">'+'@'+users[i].name+'<span class="fa fa-circle online_friend"style="margin-right:8px;"></span></h3></a></p>'
                ol.append(list);
            }
        }
        $('numOfFriends').text('('+ arr.length +')');
        $('.onlineFriends').html(ol);
    });
});
