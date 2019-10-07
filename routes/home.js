const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const db = require('../models');
const { authenticated } = require('../config/auth');
const sumAmount = require('../scripts');

const User = db.User;
const Expense = db.Expense;
const Op = Sequelize.Op;

router.get('/', authenticated, (req, res) => {
  // const selectedCategory = {};
  // if (req.query.category) {
  //   selectedCategory.category = req.query.category;
  // }
  // if (req.query.month) {
  //   selectedCategory.date = { $regex: `[/]${req.query.month}[/]` };
  // }
  // console.log(selectedCategory);
  let selectedCategory = '%';
  let selectedMonth = '%';
  if (req.query.category) selectedCategory = req.query.category;
  if (req.query.month) selectedMonth = `${req.query.month}`;
  console.log(selectedCategory, selectedMonth);
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found');
      // see sequelize querying
      return Expense.findAll({
        where: {
          UserId: req.user.id,
          category: {
            [Op.like]: selectedCategory
          },
          date: {
            [Op.like]: `_____${selectedMonth}___`
          }
        }
      });
    })
    .then(expenses => {
      let summary = null;
      for (let i = 0; i < expenses.length; i++) {
        summary += +expenses[i].amount;
      }
      return res.render('index', {
        expenses,
        summary,
        queryMonth: req.query.month,
        queryCategory: req.query.category
      });
    })
    .catch(error => {
      return res.status(422).json(error);
    });
});

module.exports = router;
