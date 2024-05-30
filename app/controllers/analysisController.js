const Transaction = require('../models/Transaction');
const Analysis = require('../models/Analysis');
const { analyzeSpendingBehavior, getLastThreeAnalyses } = require('../services/financialAnalyzer');
const { preprocessData } = require('../utils/dataProcessing');

exports.analyzeTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ uuid: req.body.uuid });
    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for the given UUID' });
    }
    const df = preprocessData(transactions);
    const analysis = analyzeSpendingBehavior(df);
    await new Analysis({ uuid: req.body.uuid, ...analysis }).save();
    res.status(200).json(analysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.compareLastThreeAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ _id: -1 }).limit(3);
    if (analyses.length < 3) {
      return res.status(404).json({ error: 'Not enough past analyses found for comparison' });
    }
    const differences = compareLastThreeAnalyses(analyses);
    res.status(200).json({ differences });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.compareLastThreeAnalyses = async (req, res) => {
  try {
      const comparison = await getLastThreeAnalyses();
      res.status(200).json({ status: 'success', comparison });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};