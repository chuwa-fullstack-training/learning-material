function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

module.exports = { todayKey };
