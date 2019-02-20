'use strict';

module.exports = function(){
    return  {
        signUpValidation: (req,res,next)=>{
            req.checkBody('username','Username is Required').notEmpty();
            req.checkBody('username','Username must not be less than five').isLength({min: 5});
            req.checkBody('email','email is required').notEmpty();
            req.checkBody('email','Email is Required').isEmail();
            req.checkBody('password','Password is Required').notEmpty(); 
            req.checkBody('password','Password must not be less than five').isLength({min: 5});

            req.getValidationResult()
            .then((result)=>{
                const errors = result.array();
                const messages = [];
                errors.forEach((error)=>{
                    messages.push(error.msg);
                });
                req.flash('error',messages);
                res.redirect('/signup');
            })
            .catch((err)=>{
                return next();
            })
        }, 
        LoginValidation: (req, res, next)=>{
             req.checkBody('email','email is required').notEmpty();
             req.checkBody('email','Email is Required').isEmail();
             req.checkBody('password','Password is Required').notEmpty(); 
             req.checkBody('password','Password must not be less than five').isLength({min: 5});
            
            req.getValidationResult()
            .then((result)=>{
                const errors = result.array();
                const messages = [];
                errors.forEach((error)=>{
                    messages.push(error.msg);
                });
                req.flash('error',messages);           
                res.redirect('/');
            })
            .catch((err)=>{
                return next();
            })
        }
    }
}

