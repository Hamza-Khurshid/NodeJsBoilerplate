var express = require('express');
var app = express.Router();
var User = require('../models/User');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var multer = require('multer');


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

// Register route
app.post('/register', upload.single('profile'), (req, res) => {
    let { name, email, password } = req.body;
    console.log("Body===> ", req.file)

    // Validation
    let errors = [];

    if(!name || !email || !password) {
        errors.push({ message: 'All fields are required.' })
    }

    if(email && !validateEmail(email)) {
        errors.push({ message: 'Email is not valid.' })
    }

    if(password && password.length < 8) {
        errors.push({ message: 'Password should be of minimum 8 characters.' })
    }

    if(!req.file) {
        errors.push({ message: 'Profile image is required.' })
    }

    if(errors.length > 0) {
        console.log("Error registeration: ", errors)
        res.send({
            errors,
            type: 'error'
        })
    } else {
        // Save user
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User already exists with this email
                    errors.push({ message: 'Email already registered.' })
                    console.log("Email already registered")
                    res.send({
                        errors,
                        type: 'error'
                    })
                } else {
                    let user = new User({
                        name,
                        email,
                        password,
                        profile: req.file.path
                    })

                    bcrypt.genSalt(10, (hash, salt) => 
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if(err) throw err;
                            
                            user.password = hash;

                            //save user to db
                            user.save()
                                .then(user => {
                                    res.send({
                                        errors: [],
                                        type: 'success',
                                        message: 'You are registered successfully.'
                                    })
                                })
                                .catch(err => console.log(err))
                        })
                    )
                }
            })
    }
})


// Login route
app.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        let errors = [];
        if(err) {
            console.log("err loging in:", err)
            errors.push(err)
            res.send({
                errors,
                type: 'error'
            })
            next()
        }

        if(info) {
            console.log("info: ", info)
            errors.push(info)
            res.send({
                errors,
                type: 'error'
            })
            next()
        }

        if(user) {
            req.logIn(user, function(err) {
                if(err) {
                    console.log("err loging in:", err)
                    errors.push(err)
                    res.send({
                        errors,
                        type: 'error'
                    })
                    next()
                } else {
                    console.log("user: ", user)
                    res.send({
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                        },
                        errors: [],
                        type: 'success',
                        message: 'You are logged in successfully.'
                    })
                    next()
                }
            });
        }
    })(req, res,next)
})

// Logout route
app.get('/logout', (req, res) => {
    req.logOut();
    res.send({
        errors: [],
        type: 'success',
        message: 'You are logged out successfully.'
    })
})

module.exports = app;