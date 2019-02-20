'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id, (err, user)=>{
        done(err, user);
    });
});
passport.use( new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email','displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => {
    User.findOne({facebook:profile.id},(err, user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null, user);     
        }else{
            const newUSer = new User();
            newUSer.facebook = profile.id;
            newUSer.fullname = profile.displayName;
            newUSer.email = profile._json.email;
            newUSer.userImage = 'htps://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUSer.fbTokens.push({token:token});
            newUSer.save((err)=>{
                return done(null,User);
            })
        }})
    }));






