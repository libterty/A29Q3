const express = require('express');
const router = express.Router();
const TrackerList = require('../models/tracker');
const { authenticated } = require('../config/auth');

router.get('/new', authenticated, (req, res) => {
  return res.render('new');
});

router.post('/new', authenticated, (req, res) => {
  const tracker = new TrackerList({
    userId: req.user._id,
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    merchant: req.body.merchant,
    amount: req.body.amount
  });
  tracker.save(err => {
    if (err) return res.status(400).send('錯誤要求');
    return res.redirect('/');
  });
});

router.get('/:id/edit', authenticated, (req, res) => {
  TrackerList.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, tracker) => {
      if (err) return res.status(400).send('錯誤要求');
      return res.render('edit', { trackers: tracker });
    }
  );
});

router.put('/:id/edit', authenticated, (req, res) => {
  TrackerList.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, tracker) => {
      if (err) return res.status(400).send('錯誤要求');
      tracker.name = req.body.name;
      tracker.category = req.body.category;
      tracker.date = req.body.date;
      tracker.merchant = req.body.merchant;
      tracker.amount = req.body.amount;

      tracker.save(err => {
        return res.redirect(`/`);
      });
    }
  );
});

router.delete('/:id/delete', authenticated, (req, res) => {
  TrackerList.findOne(
    { _id: req.params.id, userId: req.user._id },
    (err, tracker) => {
      tracker.remove(err => {
        return res.redirect('/');
      });
    }
  );
});

module.exports = router;
