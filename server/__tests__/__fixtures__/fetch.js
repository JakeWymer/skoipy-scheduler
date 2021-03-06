const baseFetchResponse = (responseJson) => {
  return Promise.resolve({
    json: () => {
      return Promise.resolve(responseJson);
    },
  });
};

const userPlaylistApiResponse = baseFetchResponse({
  href: "https://api.spotify.com/v1/users/wizzler/playlists",
  items: [
    {
      collaborative: false,
      external_urls: {
        spotify:
          "http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
      },
      href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
      id: "53Y8wT46QIMz5H4WQ8O22c",
      images: [],
      name: "Wizzlers Big Playlist 1",
      owner: {
        external_urls: {
          spotify: "http://open.spotify.com/user/wizzler",
        },
        href: "https://api.spotify.com/v1/users/wizzler",
        id: "wizzler",
        type: "user",
        uri: "spotify:user:wizzler",
      },
      public: true,
      snapshot_id:
        "bNLWdmhh+HDsbHzhckXeDC0uyKyg4FjPI/KEsKjAE526usnz2LxwgyBoMShVL+z+",
      tracks: {
        href: "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks",
        total: 30,
      },
      type: "playlist",
      uri: "spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c",
    },
  ],
  limit: 9,
  next: null,
  offset: 0,
  previous: null,
  total: 9,
});

const recommendedTracksApiResponse = baseFetchResponse({
  tracks: [
    {
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/134GdR5tUtxJrf8cpsfpyY",
          },
          href: "https://api.spotify.com/v1/artists/134GdR5tUtxJrf8cpsfpyY",
          id: "134GdR5tUtxJrf8cpsfpyY",
          name: "Elliphant",
          type: "artist",
          uri: "spotify:artist:134GdR5tUtxJrf8cpsfpyY",
        },
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1D2oK3cJRq97OXDzu77BFR",
          },
          href: "https://api.spotify.com/v1/artists/1D2oK3cJRq97OXDzu77BFR",
          id: "1D2oK3cJRq97OXDzu77BFR",
          name: "Ras Fraser Jr.",
          type: "artist",
          uri: "spotify:artist:1D2oK3cJRq97OXDzu77BFR",
        },
      ],
      disc_number: 1,
      duration_ms: 199133,
      explicit: false,
      external_urls: {
        spotify: "https://open.spotify.com/track/1TKYPzH66GwsqyJFKFkBHQ",
      },
      href: "https://api.spotify.com/v1/tracks/1TKYPzH66GwsqyJFKFkBHQ",
      id: "1TKYPzH66GwsqyJFKFkBHQ",
      is_playable: true,
      name: "Music Is Life",
      preview_url:
        "https://p.scdn.co/mp3-preview/546099103387186dfe16743a33edd77e52cec738",
      track_number: 1,
      type: "track",
      uri: "spotify:track:1TKYPzH66GwsqyJFKFkBHQ",
    },
    {
      artists: [
        {
          external_urls: {
            spotify: "https://open.spotify.com/artist/1VBflYyxBhnDc9uVib98rw",
          },
          href: "https://api.spotify.com/v1/artists/1VBflYyxBhnDc9uVib98rw",
          id: "1VBflYyxBhnDc9uVib98rw",
          name: "Icona Pop",
          type: "artist",
          uri: "spotify:artist:1VBflYyxBhnDc9uVib98rw",
        },
      ],
      disc_number: 1,
      duration_ms: 187026,
      explicit: false,
      external_urls: {
        spotify: "https://open.spotify.com/track/15iosIuxC3C53BgsM5Uggs",
      },
      href: "https://api.spotify.com/v1/tracks/15iosIuxC3C53BgsM5Uggs",
      id: "15iosIuxC3C53BgsM5Uggs",
      is_playable: true,
      name: "All Night",
      preview_url:
        "https://p.scdn.co/mp3-preview/9ee589fa7fe4e96bad3483c20b3405fb59776424",
      track_number: 2,
      type: "track",
      uri: "spotify:track:15iosIuxC3C53BgsM5Uggs",
    },
  ],
  seeds: [
    {
      initialPoolSize: 500,
      afterFilteringSize: 380,
      afterRelinkingSize: 365,
      href: "https://api.spotify.com/v1/artists/4NHQUGzhtTLFvgF5SZesLK",
      id: "4NHQUGzhtTLFvgF5SZesLK",
      type: "artist",
    },
    {
      initialPoolSize: 250,
      afterFilteringSize: 172,
      afterRelinkingSize: 144,
      href: "https://api.spotify.com/v1/tracks/0c6xIDDpzE81m2q797ordA",
      id: "0c6xIDDpzE81m2q797ordA",
      type: "track",
    },
  ],
});

module.exports = {
  userPlaylistApiResponse,
  recommendedTracksApiResponse,
};
