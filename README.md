# Financial Analyzer Project

## Overview

This project is a backend application that analyzes financial transactions. It provides endpoints for uploading transactions, analyzing spending behavior, and comparing analyses. The original implementation is based on the FastAPI framework and it uses MongoDB as the database.

## Features

- **Upload Transactions:** Upload transaction data via CSV files or single transactions.
- **Analyze Transactions:** Get a detailed analysis of spending and earning behavior.
- **Compare Analyses:** Compare the last three analyses to identify trends.

## Directory Structure
```
financial_analyzer_js/
│
├── app/
│ ├── controllers/
│ │ ├── analysisController.js
│ │ ├── healthController.js
│ │ ├── transactionController.js
│ ├── models/
│ │ ├── Analysis.js
│ │ ├── Transaction.js
│ ├── routes/
│ │ ├── analysisRoutes.js
│ │ ├── healthRoutes.js
│ │ ├── transactionRoutes.js
│ ├── services/
│ │ ├── financialAnalyzer.js
│ │ ├── transactionService.js
│ ├── utils/
│ │ ├── dataProcessing.js
│ │ ├── dataValidation.js
│ ├── database/
│ │ ├── mongo.js
│ ├── app.js
│ ├── config.js
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Installation

### Prerequisites

- Node
- MongoDB

### Setup

1. Clone the repository and install dependencies:
```
git clone https://github.com/Aukerul-Shuvo/financial_analyzer_js.git
cd financial_analyzer_js
npm install
``` 

2. Create a .env file with the following variables:
```
MONGO_URI=<YOUR DB URI>
DATABASE_NAME=<YOUR DB NAME>
```

3. Start the application:
```
npm start
```

### Running with Docker
Build and run the Docker container:
```
docker-compose up --build
```
