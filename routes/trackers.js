const express = require('express');
const router = express.Router();
const db = require('../models');
const Expense = db.Expense;
const User = db.User;
const { authenticated } = require('../config/auth');

router.get('/new', authenticated, (req, res) => {
  return res.render('new');
});

router.post('/new', authenticated, (req, res) => {
  Expense.create({
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    merchant: req.body.merchant,
    amount: req.body.amount,
    userId: req.user.id
  })
    .then(() => {
      return res.redirect('/');
    })
    .catch(err => {
      return res.status(422).json(err);
    });
});

router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found');
      return Expense.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id
        }
      });
    })
    .then(expense => {
      return res.render('edit', { expense: expense });
    });
});

router.put('/:id/edit', authenticated, (req, res) => {
  Expense.findOne({
    where: {
      Id: req.params.id,
      userId: req.user.id
    }
  })
    .then(expense => {
      expense.name = req.body.name;
      expense.category = req.body.category;
      expense.merchant = req.body.merchant;
      expense.amount = req.body.amount;
      expense.date = req.body.date;
      return expense.save();
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

router.delete('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found');
      return Expense.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      });
    })
    .then(() => {
      return res.redirect('/');
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

module.exports = router;
