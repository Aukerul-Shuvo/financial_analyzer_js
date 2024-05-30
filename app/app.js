const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const healthRoutes = require('./routes/healthRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analysisRoutes = require('./routes/analysisRoutes'); // Ensure this line is present

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.getMongoUri(), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: config.getDatabaseName()
}).then(() => {
  console.log(`Connected to MongoDB: ${config.getDatabaseName()}`);
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/health', healthRoutes);
app.use('/transactions', transactionRoutes);
app.use('/analysis', analysisRoutes); // Ensure this line is present

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
