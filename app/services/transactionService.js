const Transaction = require('../models/Transaction');
const uuid = require('uuid');

const saveTransaction = async (df, uniqueId) => {
  const transactions = df.map((row) => ({ ...row, uuid: uniqueId }));
  await Transaction.insertMany(transactions);
};

module.exports = {
  saveTransaction
};
