module.exports = function (Users, async) {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.get('/logout', this.logout)

            router.post('/group/:name', this.groupPostPage);
        },
        groupPage(req, res) {
            const name = req.params.name;
                //get the list of friend requests upon page loads or navigations to and fro to this page
            async.parallel([
                function (callback) {
                    Users.findOne({
                            'username': req.user.username
                        })
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                    }
                ], (err, results) => {
                const result1 = results[0];
                res.render('groupchat/group', {
                    title: 'chatapp - Group',
                    user: req.user,
                    groupName: name,
                    data: result1
                });
            });
        },

        groupPostPage(req, res) {
            /*first async function is for updating number of 
         requests sent and received in users collections upon a friend request*/
            async.parallel([
                function (callback) {
                    if (req.body.receiverName) {
                        Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {
                                $ne: req.user._id
                            },
                            'friendsList.friendId': {
                                $ne: req.user._id
                            }
                        }, {
                            $push: {
                                request: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            },
                            $inc: {
                                totalRequest: 1
                            }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                function (callback) {
                    if (req.body.receiverName) {
                        Users.update({
                                'username': req.user.username, //here 'user' is gotten from the get req 
                                'sentRequest.username': {      //to this page above and displayed in group.ejs 
                                    $ne: req.body.receiverName
                                } 
                            }, {
                                $push: {
                                    sentRequest: {
                                        username: req.body.receiverName
                                    }
                                }
                            },
                            (err, count) => {
                                callback(err, count);
                            })
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });

            //1st and 2nd functions in second async function is to handle accepting friend request for both sender and receiver
            async.parallel([
                //this function is for updating
                //the receiver user collection
                function (callback) {
                    if (req.body.senderId) {
                        Users.update({
                            '_id': req.user._id,
                            'friendsList.friendId': {
                                $ne: req.body.senderId
                            }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.body.senderId,
                                    friendName: req.body.senderName
                                }
                            },
                            $pull: {
                                request: {
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }
                            },
                            $inc: {
                                totalRequest: -1
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                //this function is for updating
                //the sender user collection
                function (callback) {
                    if (req.body.senderId) {
                        Users.update({
                            '_id': req.body.senderId,
                            'friendsList.friendId': {
                                $ne: req.user._id
                            }
                        }, {
                            $push: {
                                friendsList: {
                                    friendId: req.user._id,
                                    friendName: req.user.username
                                }
                            },
                            $pull: {
                                sentRequest: {
                                    username: req.user.username
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                }, //3rd and 4th functions are for updating receiver and sender collections while cancelling friend request
                function (callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': { 
                                $eq: req.body.user_Id
                            }
                        }, {
                            $pull: {
                                request: {
                                    userId: req.body.user_Id
                                }
                            },
                            $inc: {
                                totalRequest: -1
                            },
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                },
                function (callback) {
                    if (req.body.user_Id) {
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': {
                                $eq: req.user.username
                            }
                        }, {
                            $pull: {
                                sentRequest: {
                                    username: req.user.username
                                }
                            },
                        }, (err, count) => {
                            callback(err, count);
                        });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/' + req.params.name);
            });
    },
    logout(req, res){
            req.logout();
            req.session.destroy((err)=>{
                res.redirect('/');
            });
        }
    } 
}
