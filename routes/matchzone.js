const express = require('express');
const router = express.Router();
const { livescore } = require('../scrapers/football/livescore');
const { livescore2 } = require('../scrapers/football/livescore2');
const { basketballLivescore } = require('../scrapers/basketball/livescore');
const { getStreamingMatches } = require('../scrapers/football/streaming');
const { footballnews } = require('../scrapers/football/footballnews');
const { getNewsChannels, getAvailableCountries, getChannelsByCountry } = require('../scrapers/newsstreaming/channels');

router.get('/football-live', async (req, res) => {
  try {
    const [primary, logos] = await Promise.allSettled([livescore(), livescore2()]);

    let result = primary.status === 'fulfilled' ? primary.value : { sport: 'Football', totalMatches: 0, matches: [] };

    if (logos.status === 'fulfilled') {
      const logoMap = {};
      for (const m of logos.value.matches || []) {
        const key = h => h.toLowerCase().replace(/\s+/g, '');
        if (m.homeLogo) logoMap[key(m.homeTeam)] = m.homeLogo;
        if (m.awayLogo) logoMap[key(m.awayTeam)] = m.awayLogo;
      }
      const key = h => h.toLowerCase().replace(/\s+/g, '');
      result.matches = result.matches.map(m => ({
        ...m,
        homeLogo: logoMap[key(m.homeTeam)] || null,
        awayLogo: logoMap[key(m.awayTeam)] || null
      }));
    }

    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/basketball', async (req, res) => {
  try {
    const result = await basketballLivescore();
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/streaming', async (req, res) => {
  try {
    const sport = req.query.sport || 'all';
    const result = await getStreamingMatches(sport);
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/news', async (req, res) => {
  try {
    const tag = req.query.tag || '';
    const page = parseInt(req.query.page) || 1;
    const result = await footballnews(tag, page, 20);
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/tv-channels', async (req, res) => {
  try {
    const country = req.query.country || '';
    let result;
    if (country) {
      result = await getChannelsByCountry(country);
    } else {
      result = await getNewsChannels();
    }
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});


router.get('/tv-countries', async (req, res) => {
  try {
    const result = await getAvailableCountries();
    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
