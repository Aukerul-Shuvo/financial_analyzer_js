const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: String,
  date: Date,
  amount: Number,
  merchant: String,
  category: String,
  city: String,
  region: String,
  payment_method: String,
  day_of_week: Number,
  week_of_month: Number,
  month: Number,
  uuid: String
});

module.exports = mongoose.model('Transaction', transactionSchema);
