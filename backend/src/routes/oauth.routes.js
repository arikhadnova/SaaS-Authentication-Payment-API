const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { oauthCallback } = require('../controllers/oauth.controller');

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
  oauthCallback
);

// GitHub OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login', session: false }),
  oauthCallback
);

module.exports = router;