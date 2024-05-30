const express = require('express');
const multer = require('multer');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload_transactions', upload.single('file'), transactionController.uploadTransactions);
router.post('/upload_single_transaction', transactionController.uploadSingleTransaction);

module.exports = router;
