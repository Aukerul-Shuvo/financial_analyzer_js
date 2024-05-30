const Analysis = require('../models/Analysis');

const analyzeSpendingBehavior = (df) => {
  df.sort((a, b) => new Date(a.date) - new Date(b.date));
  df.forEach(row => {
      row.amount = parseFloat(row.amount); // Ensure amount is number
      row.week_of_month = Math.floor((new Date(row.date).getDate() - 1) / 7) + 1;
  });

  const spendingThreshold = quantile(df.filter(row => row.amount < 0).map(row => row.amount), 0.75);
  const earningThreshold = quantile(df.filter(row => row.amount > 0).map(row => row.amount), 0.75);

  const analysisResult = {};
  for (let week = 1; week <= 5; week++) {
      const weeklyData = df.filter(row => row.week_of_month === week);
      if (weeklyData.length > 0) {
          const highSpending = weeklyData.filter(row => row.amount < 0 && row.amount <= spendingThreshold);
          const highEarning = weeklyData.filter(row => row.amount > 0 && row.amount >= earningThreshold);

          analysisResult[`week_${week}`] = {
              total_spent: sum(weeklyData.filter(row => row.amount < 0).map(row => row.amount)),
              total_earned: sum(weeklyData.filter(row => row.amount > 0).map(row => row.amount)),
              high_spending_days: aggregateByDay(highSpending),
              high_earning_days: aggregateByDay(highEarning)
          };
      }
  }
  return analysisResult;
};

const quantile = (arr, q) => {
  const sorted = arr.slice().sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if ((sorted[base + 1] !== undefined)) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
      return sorted[base];
  }
};

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const aggregateByDay = (data) => {
  return data.reduce((acc, row) => {
      const day = new Date(row.date).getDate();
      acc[day] = (acc[day] || 0) + row.amount;
      return acc;
  }, {});
};

const getHistoricalAverageSpending = (df, year, month, weekOfMonth) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  const weekData = previousData.filter(row => row.week_of_month === weekOfMonth);
  
  console.log(`Filtered previous data length: ${previousData.length}`); // Debug statement
  console.log(`Filtered week data length: ${weekData.length}`); // Debug statement

  if (weekData.length > 0) {
      const spendingAmounts = weekData.filter(row => row.amount < 0).map(row => parseFloat(row.amount));
      console.log(`Spending amounts: ${spendingAmounts}`); // Debug statement

      if (spendingAmounts.length > 0) {
          return sum(spendingAmounts) / spendingAmounts.length;
      }
  }
  return null;
};

const getHistoricalAverageEarnings = (df, year, month, weekOfMonth) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  const weekData = previousData.filter(row => row.week_of_month === weekOfMonth);
  
  console.log(`Filtered previous data length: ${previousData.length}`); // Debug statement
  console.log(`Filtered week data length: ${weekData.length}`); // Debug statement

  if (weekData.length > 0) {
      const earningsAmounts = weekData.filter(row => row.amount > 0).map(row => parseFloat(row.amount));
      console.log(`Earnings amounts: ${earningsAmounts}`); // Debug statement

      if (earningsAmounts.length > 0) {
          return sum(earningsAmounts) / earningsAmounts.length;
      }
  }
  return null;
};

const getCurrentWeekSpending = (df, year, month, weekOfMonth) => {
  const currentWeekData = df.filter(row => row.year === year && row.month === month && row.week_of_month === weekOfMonth);
  console.log(`Current week data: ${JSON.stringify(currentWeekData)}`); // Debug statement

  const spending = currentWeekData.filter(row => row.amount < 0).map(row => parseFloat(row.amount));
  console.log(`Current week spending: ${spending}`); // Debug statement

  const totalSpending = sum(spending);
  console.log(`Total spending for the current week: ${totalSpending}`); // Debug statement

  return totalSpending;
};

const getCurrentWeekEarnings = (df, year, month, weekOfMonth) => {
  const currentWeekData = df.filter(row => row.year === year && row.month === month && row.week_of_month === weekOfMonth);
  console.log(`Current week data: ${JSON.stringify(currentWeekData)}`); // Debug statement

  const earnings = currentWeekData.filter(row => row.amount > 0).map(row => parseFloat(row.amount));
  console.log(`Current week earnings: ${earnings}`); // Debug statement

  const totalEarnings = sum(earnings);
  console.log(`Total earnings for the current week: ${totalEarnings}`); // Debug statement

  return totalEarnings;
};

const getMonthlyTotals = (df, year, month) => {
  const currentMonthData = df.filter(row => row.year === year && row.month === month);
  
  const totalSpent = sum(currentMonthData.filter(row => row.amount < 0).map(row => parseFloat(row.amount)));
  const totalEarned = sum(currentMonthData.filter(row => row.amount > 0).map(row => parseFloat(row.amount)));
  
  return [totalSpent, totalEarned];
};

const getHistoricalMonthlyTotals = (df, year, month) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  console.log(`Previous data length: ${previousData.length}`); // Debug statement
  
  const spendingAmounts = previousData.filter(row => row.amount < 0).map(row => parseFloat(row.amount));
  console.log(`Historical spending amounts: ${spendingAmounts}`); // Debug statement

  const totalSpent = sum(spendingAmounts);
  console.log(`Historical total spent: ${totalSpent}`); // Debug statement

  const earningAmounts = previousData.filter(row => row.amount > 0).map(row => parseFloat(row.amount));
  console.log(`Historical earning amounts: ${earningAmounts}`); // Debug statement

  const totalEarned = sum(earningAmounts);
  console.log(`Historical total earned: ${totalEarned}`); // Debug statement

  return [totalSpent, totalEarned];
};

const getOverallTotals = (df) => {
  const spendingAmounts = df.filter(row => row.amount < 0).map(row => parseFloat(row.amount));
  console.log(`Overall spending amounts: ${spendingAmounts}`); // Debug statement

  const totalSpent = sum(spendingAmounts);
  console.log(`Overall total spent: ${totalSpent}`); // Debug statement

  const earningAmounts = df.filter(row => row.amount > 0).map(row => parseFloat(row.amount));
  console.log(`Overall earning amounts: ${earningAmounts}`); // Debug statement

  const totalEarned = sum(earningAmounts);
  console.log(`Overall total earned: ${totalEarned}`); // Debug statement

  return [totalSpent, totalEarned];
};



const compareAnalyses = (analysis1, analysis2, analysis3) => {
  const differences = {};

  const compareValues = (val1, val2, val3) => {
      return {
          analysis1: parseFloat(val1 !== null ? val1 : 0),
          analysis2: parseFloat(val2 !== null ? val2 : 0),
          analysis3: parseFloat(val3 !== null ? val3 : 0),
          difference_a2_a1: parseFloat(val2 !== null ? val2 : 0) - parseFloat(val1 !== null ? val1 : 0),
          difference_a3_a1: parseFloat(val3 !== null ? val3 : 0) - parseFloat(val1 !== null ? val1 : 0),
          difference_a3_a2: parseFloat(val3 !== null ? val3 : 0) - parseFloat(val2 !== null ? val2 : 0)
      };
  };

  const filterFields = (analysis) => {
      const filtered = {};
      for (const key in analysis) {
          if (!["$__", "$isNew", "_id", "uuid", "__v", "transaction_id", "overall_spending", "overall_earnings"].includes(key)) {
              filtered[key] = analysis[key];
          }
      }
      return filtered;
  };

  const analysis1Filtered = filterFields(analysis1.toObject());
  const analysis2Filtered = filterFields(analysis2.toObject());
  const analysis3Filtered = filterFields(analysis3.toObject());

  for (const key of Object.keys(analysis1Filtered)) {
      differences[key] = compareValues(analysis1Filtered[key], analysis2Filtered[key], analysis3Filtered[key]);
  }

  return differences;
};

const getLastThreeAnalyses = async () => {
  const analyses = await Analysis.find().sort({ _id: -1 }).limit(3).exec();
  if (analyses.length < 3) {
      throw new Error("Not enough analyses to compare. At least 3 analyses are required.");
  }
  return compareAnalyses(analyses[0], analyses[1], analyses[2]);
};




module.exports = {
  analyzeSpendingBehavior,
  getHistoricalAverageSpending,
  getHistoricalAverageEarnings,
  getCurrentWeekSpending,
  getCurrentWeekEarnings,
  getMonthlyTotals,
  getHistoricalMonthlyTotals,
  getOverallTotals,
  compareAnalyses,
  getLastThreeAnalyses
};

