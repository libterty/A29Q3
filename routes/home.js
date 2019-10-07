const express = require('express');
const router = express.Router();
const trackerList = require('../models/tracker');
const { authenticated } = require('../config/auth');

router.get('/', authenticated, (req, res) => {
  const selectedCategory = {};
  if (req.query.category) {
    selectedCategory.category = req.query.category;
  }
  if (req.query.month) {
    selectedCategory.date = { $regex: `[/]${req.query.month}[/]` };
  }
  console.log(selectedCategory);
  trackerList
    .find({ userId: req.user._id })
    .find(selectedCategory)
    .exec((err, trackerLists) => {
      if (err) return res.status(400).send('Bad Request');
      let summary = null;
      for (let i = 0; i < trackerLists.length; i++) {
        summary += +trackerLists[i].amount;
      }
      return res.render('index', {
        trackers: trackerLists,
        summary: summary,
        queryMonth: req.query.month,
        queryCategory: req.query.category
      });
    });
});

module.exports = router;
