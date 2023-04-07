
const passport = require('passport');
const config = require('../config/database');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");

const bodyParser = require("body-parser");
//check login
const mdw = require('../middelware/usermid.js');

// // parse requests of content-type - application/json
router.use(bodyParser.json());

const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);

router.post('/signup', async function (req, res) {

    if (!req.body.email || !req.body.pswd) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        const newUser = new User({
            username: req.body.email,
            password: req.body.pswd
        });
        // save the user
        await newUser.save();

        res.json({ success: true, msg: 'Successful created new user.' });
    }
});


router.post('/signin', async function (req, res) {
    console.log(req.body);
    let user = await User.findOne({ username: req.body.email });
    console.log(user);
    if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
        // check if password matches
        user.comparePassword(req.body.pswd, function (err, isMatch) {
            if (isMatch && !err) {
                const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: '1h' });
                // lưu token vào biến
                let authToken = 'JWT ' + token;
                req.session.userLogin = authToken;
                console.log('\n' + authToken + ' check');
                res.redirect('/api/book');
            } else {
                res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        });
    }
});


router.post('/book', mdw.check_login, async function (req, res) {
    const token = req.session.userLogin;
    console.log(token + ' check add book');
    if (token) {
        console.log(req.body);
        var newBook = new Book({
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher
        });
        try {
            await newBook.save();
            res.json({ success: true, msg: 'Successful created new book.' });
        } catch (err) {
            return res.json({ success: false, msg: 'Save book failed.' });
        }
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});


router.get('/book', mdw.check_login, async function (req, res) {
    let authToken = req.session.userLogin;
    console.log('\n' + authToken + ' token');
    if (authToken) {
        try {
            const decoded = jwt.verify(authToken.split(' ')[1], config.secret);
            if (decoded.exp > Date.now() / 1000) { // Kiểm tra xem token còn hạn sử dụng không
                let books = await Book.find().lean();
                //res.json(books);
                res.render('emptyView', {
                    layout: 'listbook',
                    books: books,
                })
            } else {
                return res.status(403).send({ success: false, msg: 'Token expired.' });
            }
        } catch (error) {
            //return res.status(403).send({ success: false, msg: 'Invalid token.' });
            return res.redirect('/');
        }
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
