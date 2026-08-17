const Habit = require('../models/Habit');
const CheckIn = require('../models/CheckIn');
const CustomAPIError = require('../errors');
const { todayKey } = require('../utils/date');

// Idempotent: checking in twice on the same day doesn't error or duplicate
// — the unique index on (habit, date) is the actual source of truth, this
// just avoids a needless 500 when the frontend calls it more than once.
async function createCheckIn(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.habitId, user: req.user.id });
    if (!habit) {
      throw new CustomAPIError('Habit not found', 404);
    }

    const date = todayKey();
    const alreadyCheckedIn = await CheckIn.findOne({ habit: habit._id, date });
    if (!alreadyCheckedIn) {
      await CheckIn.create({ habit: habit._id, date });
    }

    const checkIns = await CheckIn.find({ habit: habit._id }).lean();
    res.status(201).json({ checkIns: checkIns.map((c) => c.date) });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCheckIn };
