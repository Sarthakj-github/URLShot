const express = require('express');

const router = express.Router();

const { shortenUrl, redirectToOriginalUrl } = require('../controllers/urlController');

router.post('/shorten', shortenUrl);

router.get('/:code', redirectToOriginalUrl);

module.exports = router;