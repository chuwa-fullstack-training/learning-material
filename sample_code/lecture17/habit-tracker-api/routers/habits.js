const express = require('express');
const { getAllHabits, createHabit, deleteHabit } = require('../controllers/habits');
const { createCheckIn } = require('../controllers/checkIns');

const router = express.Router();

// /api/habits
router.get('/', getAllHabits);
router.post('/', createHabit);
router.delete('/:id', deleteHabit);

// /api/habits/:habitId/check-ins
router.post('/:habitId/check-ins', createCheckIn);

module.exports = router;
