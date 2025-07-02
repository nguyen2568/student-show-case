const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get("/milestone/:username", async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });
    const websiteUrl = process.env.FRONT_END_URL || "http://recyclebox.rocks"; // Default to localhost if not set
    //get canCount from DB
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    //get accumulated canCount
    let canCount = 0;
    let plasticCount = 0;

    const metal = user.accumulatedPoints.find(point => point.material === "metal");
    if (metal) {
        canCount = metal.count;
    }

    const plastic = user.accumulatedPoints.find(point => point.material === "plastic");
    if (plastic) {
        plasticCount = plastic.count;
    }

    // You can fetch data from DB if needed here
    const title = `Proud to share my recycling milestone with you!`;
    const description = `Join with me and make a positive impact by recycling today.`;
    const imageUrl = `${req.protocol}://${req.get('host')}/dashboard_bg.png`;
    const redirectUrl = `${websiteUrl}/share/${canCount}/${plasticCount}`;
    const userAgent = req.get('User-Agent') || '';
    const isBot = /facebookexternalhit|facebookcatalog|Twitterbot|Slackbot-LinkExpanding/i.test(userAgent);

    if (isBot) {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico">
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
      <meta property="og:type" content="website" />
      <title>Redirecting...</title>
    </head>
    <body>
            <p>Redirecting to your milestone page...</p>
    </body>
    </html>
  `);
    }

    res.redirect(redirectUrl);
});

module.exports = router;
