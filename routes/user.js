const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../models');

const { User } = db;

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: req.flash('warning_msg', '帳號或密碼錯誤')
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!email || !password || !password2) {
    errors.push({ message: '信箱和密碼是必填' });
    res.status(400).send('信箱和密碼是必填');
  }

  if (password !== password2) {
    errors.push({ message: '密碼輸入錯誤' });
    res.status(400).send('密碼輸入錯誤');
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ where: { email } }).then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) return console.error(err);
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// 登出
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', '你已經成功登出');
  res
    .status(200)
    .redirect('/users/login')
    .send('你已經成功登出');
});

module.exports = router;
