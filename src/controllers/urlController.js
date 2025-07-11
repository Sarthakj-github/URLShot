//const { nanoid } = require('nanoid');

const validUrl = require('valid-url');

const Url = require('../models/Url');

const shortenUrl = async (req, res) => {

    const { originalUrl, ttl } = req.body;
    const baseUrl = process.env.BASE_URL;

    if(!validUrl.isUri(baseUrl)) {
        return res.tatus(500).json({ error: 'Internal error: Invalid base URL'});
    }

    if(!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }

    if(!validUrl.isUri(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {

        let url = await Url.findOne({ originalUrl });

        if(url) {

            const shortUrl = `${baseUrl}/${url.shortCode}`;
            return res.status(200).json({ shortUrl });

        } else {

            const { nanoid } = await import('nanoid');
            const shortCode = nanoid(7);

            const shortUrl = `${baseUrl}/${shortCode}`;

            let expiresAt = null;
            
            if(ttl && !isNaN(parseInt(ttl))) {
                expiresAt = new Date(Date.now() + parseInt(ttl)*1000);
            }

            url = new Url({
                originalUrl,
                shortCode,
                expiresAt,
            });

            await url.save();

            return res.status(201).json({ shortUrl });
        }
    } catch (err) {

        console.error(err);

        return res.status(500).json({ error: 'Server error, please try again' });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {

        const { code } = req.params;
        const url = await Url.findOne({ shortCode: code});

        if(url) {

            if(url.expiresAt && url.expiresAt < new Date()) {

                return res.status(410).json({ error: 'This link has expired.'});
            }

            return res.redirect(301, url.originalUrl);

        } else {

            return res.status(404).json({ error: 'No URL found for this code'});

        }
    } catch (err) {

        console.error(err);

        return res.status(500).json({error: 'Server error' });
    }
};

const updateUrlExpiry = async (req, res) => {
    
    try {
        const { code } = req.params;
        const { ttl } = req.body;

        if(ttl != null && isNaN(parseInt(ttl))) {
            return res.status(400).json({ error: 'Invalid TTL format. Must be a number or null.'});
        }

        let newExpiresAt;

        if(ttl === null) {
            newExpiresAt = null;
        } else{
            newExpiresAt = new Date(Date.now() + parseInt(ttl)*1000);
        }

        const updatedUrl = await Url.findOneAndUpdate(
            { shortCode: code},
            { $set: {expiresAt: newExpiresAt}},
            { new: true}
        );

        if(updatedUrl) {

            const message = newExpiresAt 
            ? `Expiry extended to ${newExpiresAt.toISOString()}`
            : 'Link is now permanent and will not expire.';

            const customResponse = {
                shortCode: updatedUrl.shortCode,
                message: message,
                // newExpiresAt: updatedUrl.expiresAt
            };

            return res.status(200).json(customResponse);

        } else {
            return res.status(404).json({ error: 'No URL found for this code' });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    shortenUrl,
    redirectToOriginalUrl,
    updateUrlExpiry,
};