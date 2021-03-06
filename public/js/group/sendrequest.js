$(document).ready(function () {
    var socket = io();
    var room = $("#groupName").val();
    var sender = $('#sender').val();

    socket.on('connect', function () {
        var params = {
            sender: sender
        };
        socket.emit('joinRequest', params, function () {
            console.log('joined');
        });
    });
    socket.on('newFriendRequest', function (friend) {
        $("#reload").load(location.href + ' #reload');

        $(document).on('click', '#accept_friend', function () {
            var senderId = $("#senderId").val();
            var senderName = $("#senderName").val();
            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success() {
                    $(this).parent().eq(1).remove();
                }
            });
            $("#reload").load(location.href + ' #reload');
        });
        $(document).on('click', '#cancel_friend', function () {
            var user_Id = $("#user_Id").val();
            console.log('cancelling request ' + user_Id);
            $.ajax({
                url: '/group/' + room,
                type: 'POST',
                data: {
                    user_Id: user_Id
                },
                success() {
                    $(this).parent().eq(1).remove();
                }
            });
            $("#reload").load(location.href + ' #reload');
        });
    });

    $("#add_friend").on('submit', function (e) {
        e.preventDefault();
        var receiverName = $("#receiverName").val();
        $.ajax({
            url: '/group/' + room,
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success() {
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender
                }, () => {
                    console.log('Request Sent');
                });
            }
        });
    });


});
