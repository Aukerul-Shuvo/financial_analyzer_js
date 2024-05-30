const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const preprocessData = (transactions) => {
  return transactions.map(transaction => {
    const date = new Date(transaction.date);
    return {
      ...transaction,
      year: date.getFullYear(),
      month: date.getMonth() + 1, // Add 1, as month is indexed from 0
      week_of_month: Math.floor((date.getDate() - 1) / 7) + 1,
      amount: parseFloat(transaction.amount) // Ensure amount is number
    };
  });
};

const preprocessSingleTransaction = (transaction) => {
  const date = new Date(transaction.date);
  return {
    ...transaction,
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Add 1, as month is indexed from 0
    week_of_month: Math.floor((date.getDate() - 1) / 7) + 1,
    amount: parseFloat(transaction.amount) // Ensure amount is number
  };
};

const getCurrentWeekSpending = (df, year, month, weekOfMonth) => {
  const currentWeekData = df.filter(row => row.year === year && row.month === month && row.week_of_month === weekOfMonth);
  return sum(currentWeekData.filter(row => row.amount < 0).map(row => parseFloat(row.amount)));
};

const getCurrentWeekEarnings = (df, year, month, weekOfMonth) => {
  const currentWeekData = df.filter(row => row.year === year && row.month === month && row.week_of_month === weekOfMonth);
  return sum(currentWeekData.filter(row => row.amount > 0).map(row => parseFloat(row.amount)));
};

const getHistoricalAverageSpending = (df, year, month, weekOfMonth) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  const weekData = previousData.filter(row => row.week_of_month === weekOfMonth);
  if (weekData.length > 0) {
    return sum(weekData.filter(row => row.amount < 0).map(row => parseFloat(row.amount))) / weekData.length;
  }
  return null;
};

const getHistoricalAverageEarnings = (df, year, month, weekOfMonth) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  const weekData = previousData.filter(row => row.week_of_month === weekOfMonth);
  if (weekData.length > 0) {
    return sum(weekData.filter(row => row.amount > 0).map(row => parseFloat(row.amount))) / weekData.length;
  }
  return null;
};

const getMonthlyTotals = (df, year, month) => {
  const currentMonthData = df.filter(row => row.year === year && row.month === month);
  const totalSpent = sum(currentMonthData.filter(row => row.amount < 0).map(row => parseFloat(row.amount)));
  const totalEarned = sum(currentMonthData.filter(row => row.amount > 0).map(row => parseFloat(row.amount)));
  return [totalSpent, totalEarned];
};

const getHistoricalMonthlyTotals = (df, year, month) => {
  const previousData = df.filter(row => row.year !== year || row.month !== month);
  const totalSpent = sum(previousData.filter(row => row.amount < 0).map(row => parseFloat(row.amount)));
  const totalEarned = sum(previousData.filter(row => row.amount > 0).map(row => parseFloat(row.amount)));
  return [totalSpent, totalEarned];
};

const getOverallTotals = (df) => {
  const totalSpent = sum(df.filter(row => row.amount < 0).map(row => parseFloat(row.amount)));
  const totalEarned = sum(df.filter(row => row.amount > 0).map(row => parseFloat(row.amount)));
  return [totalSpent, totalEarned];
};

module.exports = {
  preprocessData,
  preprocessSingleTransaction,
  getCurrentWeekSpending,
  getCurrentWeekEarnings,
  getHistoricalAverageSpending,
  getHistoricalAverageEarnings,
  getMonthlyTotals,
  getHistoricalMonthlyTotals,
  getOverallTotals
};
