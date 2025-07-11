const express = require('express');
const router = express.Router();

const { shortenUrl, redirectToOriginalUrl, updateUrlExpiry } = require('../controllers/urlController');

router.post('/shorten', shortenUrl);

router.patch('/url/:code', updateUrlExpiry);

router.get('/:code', redirectToOriginalUrl);

module.exports = router;