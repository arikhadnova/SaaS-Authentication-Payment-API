const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./prisma');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const providerId = profile.id;

    // Cek apakah OAuth account sudah ada
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: 'google',
          providerId
        }
      },
      include: { user: true }
    });

    if (oauthAccount) {
      // Sudah pernah login dengan Google → langsung return user
      return done(null, oauthAccount.user);
    }

    // Cek apakah email sudah terdaftar dengan cara lain
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Belum ada → buat user baru
      user = await prisma.user.create({
        data: {
          email,
          name,
          provider: 'google'
        }
      });
    }

    // Buat OAuth account baru
    await prisma.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: 'google',
        providerId,
        accessToken
      }
    });

    return done(null, user);

  } catch (error) {
    return done(error, null);
  }
}));

const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;
    const providerId = String(profile.id);

    if (!email) {
      return done(new Error('No email found from GitHub'), null);
    }

    // Cek apakah OAuth account sudah ada
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider: 'github',
          providerId
        }
      },
      include: { user: true }
    });

    if (oauthAccount) {
      // Sudah pernah login dengan GitHub
      return done(null, oauthAccount.user);
    }

    // Cek apakah email sudah terdaftar
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Buat user baru
      user = await prisma.user.create({
        data: {
          email,
          name,
          provider: 'github'
        }
      });
    }

    // Buat OAuth account baru
    await prisma.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: 'github',
        providerId,
        accessToken
      }
    });

    return done(null, user);

  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;