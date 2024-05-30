const { MongoClient } = require('mongodb');
const config = require('../config');

const uri = config.getMongoUri();
const databaseName = config.getDatabaseName();

let db;

const initializeDb = async () => {
    if (db) {
        return db;
    }
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(databaseName);
    console.log(`Connected to database: ${databaseName}`);
    return db;
};

const saveTransaction = async (transactions, uniqueId) => {
    const database = await initializeDb();
    const records = transactions.map(record => ({ ...record, uuid: uniqueId }));
    await database.collection('transactions').insertMany(records);
};

const getTotalTransactionCount = async () => {
    const database = await initializeDb();
    return await database.collection('transactions').countDocuments();
};

const getAllTransactions = async () => {
    const database = await initializeDb();
    return await database.collection('transactions').find().toArray();
};

const saveAnalysis = async (analysis) => {
    const database = await initializeDb();
    await database.collection('analyses').insertOne(analysis);
};

module.exports = {
    saveTransaction,
    getTotalTransactionCount,
    getAllTransactions,
    saveAnalysis
};
