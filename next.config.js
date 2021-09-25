const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withVideos = require("next-videos");

module.exports = withPlugins(
  [
    [withImages, {}],
    [withVideos, {}],
  ],
  {
    /* global config here ... */ images: {
      domains: [
        "image.tmdb.org",
        "platform-lookaside.fbsbx.com",
        "firebasestorage.googleapis.com",
        "platform-lookaside.fbsbx.com",
        "lh3.googleusercontent.com",
        "thumbs.dreamstime.com",
        "media.wired.com",
        "images.unsplash.com",
        "cdn.vox-cdn.com",
        "a0.muscache.com",
        "www.airbnb.com",
        "images.ctfassets.net",
        "www.bang-olufsen.com",
      ],
    },
  }
);
