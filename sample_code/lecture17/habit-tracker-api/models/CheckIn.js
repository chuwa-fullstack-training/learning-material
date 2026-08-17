const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true
  }
});

// One check-in per habit per day — enforced at the database level, not just
// in application code.
checkInSchema.index({ habit: 1, date: 1 }, { unique: true });

const CheckIn = mongoose.model('CheckIn', checkInSchema);

module.exports = CheckIn;
