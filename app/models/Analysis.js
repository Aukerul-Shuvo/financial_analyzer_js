const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  transaction_id: String,
  historical_average_spending: Number,
  current_week_spending: Number,
  spending_comparison: Number,
  historical_average_earnings: Number,
  current_week_earnings: Number,
  earnings_comparison: Number,
  current_month_spending: Number,
  current_month_earnings: Number,
  historical_month_spending: Number,
  historical_month_earnings: Number,
  overall_spending: Number,
  overall_earnings: Number
});

module.exports = mongoose.model('Analysis', analysisSchema);
