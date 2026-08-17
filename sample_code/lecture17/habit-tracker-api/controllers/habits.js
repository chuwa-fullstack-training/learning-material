const Habit = require('../models/Habit');
const CheckIn = require('../models/CheckIn');
const CustomAPIError = require('../errors');

// Returns each habit with a `checkIns: string[]` field attached — the exact
// shape the frontend's mock data (sample_code/lecture15-16/habit-tracker)
// already used. Keeping this shape stable means the Redux slice and
// components don't need to change at all when switching from mock data to
// this real API — only the fetch call itself does.
async function getAllHabits(req, res, next) {
  try {
    const habits = await Habit.find({ user: req.user.id }).lean();
    const checkIns = await CheckIn.find({
      habit: { $in: habits.map((h) => h._id) }
    }).lean();

    const checkInsByHabit = {};
    checkIns.forEach((checkIn) => {
      const key = checkIn.habit.toString();
      if (!checkInsByHabit[key]) checkInsByHabit[key] = [];
      checkInsByHabit[key].push(checkIn.date);
    });

    const result = habits.map((habit) => ({
      id: habit._id,
      name: habit.name,
      category: habit.category,
      checkIns: checkInsByHabit[habit._id.toString()] || []
    }));

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function createHabit(req, res, next) {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      throw new CustomAPIError('name and category are required', 400);
    }

    const habit = await Habit.create({ user: req.user.id, name, category });
    res.status(201).json({ id: habit._id, name: habit.name, category: habit.category, checkIns: [] });
  } catch (err) {
    next(err);
  }
}

async function deleteHabit(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      throw new CustomAPIError('Habit not found', 404);
    }

    await Habit.deleteOne({ _id: habit._id });
    await CheckIn.deleteMany({ habit: habit._id });

    res.status(200).json({ message: 'Habit deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllHabits, createHabit, deleteHabit };
