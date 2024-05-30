const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
const { preprocessData, preprocessSingleTransaction } = require('../utils/dataProcessing');
const {
    saveTransaction,
    getTotalTransactionCount,
    getAllTransactions,
    saveAnalysis
} = require('../database/mongo');
const {
    getHistoricalAverageSpending,
    getHistoricalAverageEarnings,
    getCurrentWeekSpending,
    getCurrentWeekEarnings,
    getMonthlyTotals,
    getHistoricalMonthlyTotals,
    getOverallTotals
} = require('../services/financialAnalyzer');

exports.uploadTransactions = async (req, res) => {
    try {
        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const df = preprocessData(results);
                const uniqueId = uuidv4();
                await saveTransaction(df, uniqueId);

                const totalTransactionCount = await getTotalTransactionCount();
                if (totalTransactionCount < 30) {
                    return res.status(200).json({ status: 'success', message: 'Not enough data to give analysis, but the data is saved to the database.', uuid: uniqueId });
                }

                const allTransactions = await getAllTransactions();

                const comparisons = await Promise.all(df.map(async (row) => {
                    const year = row.year;
                    const month = row.month;
                    const week_of_month = row.week_of_month;

                    const historical_avg_spending = getHistoricalAverageSpending(allTransactions, year, month, week_of_month);
                    const historical_avg_earnings = getHistoricalAverageEarnings(allTransactions, year, month, week_of_month);
                    const current_week_spending = getCurrentWeekSpending(allTransactions, year, month, week_of_month);
                    const current_week_earnings = getCurrentWeekEarnings(allTransactions, year, month, week_of_month);
                    const [current_month_spending, current_month_earnings] = getMonthlyTotals(allTransactions, year, month);
                    const [historical_month_spending, historical_month_earnings] = getHistoricalMonthlyTotals(allTransactions, year, month);

                    const analysis = {
                        transaction_id: row.transaction_id,
                        historical_average_spending: historical_avg_spending,
                        current_week_spending,
                        spending_comparison: current_week_spending - historical_avg_spending,
                        historical_average_earnings: historical_avg_earnings,
                        current_week_earnings,
                        earnings_comparison: current_week_earnings - historical_avg_earnings,
                        current_month_spending,
                        current_month_earnings,
                        historical_month_spending,
                        historical_month_earnings
                    };

                    await saveAnalysis(analysis);
                    return analysis;
                }));

                res.status(200).json({ status: 'success', uuid: uniqueId, comparisons });
            });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.uploadSingleTransaction = async (req, res) => {
    try {
        const transaction = req.body;
        const df = preprocessSingleTransaction(transaction);
        const uniqueId = transaction.uuid || uuidv4();
        await saveTransaction([df], uniqueId);

        const totalTransactionCount = await getTotalTransactionCount();
        if (totalTransactionCount < 30) {
            return res.status(200).json({ status: 'success', message: 'Not enough data to give analysis, but the data is saved to the database.', uuid: uniqueId });
        }

        const allTransactions = await getAllTransactions();
        const year = df.year;
        const month = df.month;
        const week_of_month = df.week_of_month;

        const historical_avg_spending = getHistoricalAverageSpending(allTransactions, year, month, week_of_month);
        const historical_avg_earnings = getHistoricalAverageEarnings(allTransactions, year, month, week_of_month);
        const current_week_spending = getCurrentWeekSpending(allTransactions, year, month, week_of_month);
        const current_week_earnings = getCurrentWeekEarnings(allTransactions, year, month, week_of_month);
        const [current_month_spending, current_month_earnings] = getMonthlyTotals(allTransactions, year, month);
        const [historical_month_spending, historical_month_earnings] = getHistoricalMonthlyTotals(allTransactions, year, month);

        const comparison = {
            transaction_id: transaction.transaction_id,
            historical_average_spending: historical_avg_spending,
            current_week_spending,
            spending_comparison: current_week_spending - historical_avg_spending,
            historical_average_earnings: historical_avg_earnings,
            current_week_earnings,
            earnings_comparison: current_week_earnings - historical_avg_earnings,
            current_month_spending,
            current_month_earnings,
            historical_month_spending,
            historical_month_earnings
        };

        await saveAnalysis(comparison);
        res.status(200).json({ status: 'success', uuid: uniqueId, comparison });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
