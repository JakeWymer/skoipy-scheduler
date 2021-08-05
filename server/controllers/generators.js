const fetch = require("node-fetch");
const { Generator, User } = require("../models");
const logger = require("../logger");
const { mp, EVENTS, PROPERTIES } = require("../tracking");

const handleSearch = async (ctx) => {
  const { accessToken } = ctx.state.user;
  const searchTerm = ctx.request.query?.term;
  const searchUrl = `https://api.spotify.com/v1/search?q=${searchTerm}&type=artist,track`;
  const rawResponse = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const searchRes = await rawResponse.json();
  ctx.response.body = searchRes;
};

const createGenerator = async (ctx) => {
  const user = ctx.state.user;
  let error = null;
  try {
    const body = ctx.request.body;
    const { generatorName, generatorSeeds, generatorFrequency, generatorDay } =
      body;
    await Generator.create({
      owner_id: user.id,
      name: generatorName,
      seeds: generatorSeeds,
      schedule_frequency: generatorFrequency,
      schedule_day: generatorDay,
    });
    mp.track(EVENTS.GENERATOR_CREATED, {
      [PROPERTIES.USER_ID]: user.id,
      [PROPERTIES.GENERATOR_NAME]: generatorName,
      [PROPERTIES.DISTINCT_ID]: user.id,
    });
  } catch (e) {
    console.error(e);
    error = `Failed to create generator`;
    mp.track(EVENTS.GENERATOR_CREATION_FAILED, {
      [PROPERTIES.USER_ID]: user.id,
      [PROPERTIES.GENERATOR_NAME]: generatorName,
      [PROPERTIES.DISTINCT_ID]: user.id,
    });
  }
  const generators = await getGeneratorsByOwnerId(user.id);
  ctx.response.body = { generators, error };
};

const generatePlaylist = async (ctx) => {
  const response = { isError: false };
  try {
    const generatorId = parseInt(ctx.params.id);
    const user = ctx.state.user;
    const generator = await Generator.findOne({
      where: {
        id: generatorId,
      },
      include: [User],
    });
    if (user.id !== generator.User.id) {
      throw new Error("Only owner can generate playlist");
    }
    await buildPlaylist(generator, user);
    ctx.response.body = response;
    mp.track(EVENTS.PLAYLIST_GENERATED, {
      [PROPERTIES.USER_ID]: user.id,
      [PROPERTIES.GENERATOR_ID]: generatorId,
      [PROPERTIES.DISTINCT_ID]: user.id,
    });
  } catch (err) {
    console.log(err);
    mp.track(EVENTS.PLAYLIST_GENERATION_FAILED, {
      [PROPERTIES.GENERATOR_ID]: generatorId,
      [PROPERTIES.DISTINCT_ID]: user.id,
    });
    response.isError = true;
    ctx.response.body = response;
  }
};

const buildPlaylist = async (generator, user) => {
  try {
    const recommendedTracks = await getRecommendedTracks(
      user.accessToken,
      generator.seeds
    );
    const trackUris = recommendedTracks.map((track) => {
      return track.uri;
    });
    const playlist = await createPlaylist(user, generator.name);
    await addTracksToPlaylist(user.accessToken, playlist.id, trackUris);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not create playlist`);
  }
};

const getUserGenerators = async (ctx) => {
  const response = { isError: false, generators: [] };
  try {
    const userGenerators = await getGeneratorsByOwnerId(ctx.state.user.id);
    response.generators = userGenerators;
  } catch (err) {
    logger.error(err);
    response.isError = true;
  }
  ctx.response.body = response;
};

const getGeneratorsByOwnerId = async (ownerId) => {
  const generators = await Generator.findAll({
    where: {
      owner_id: ownerId,
    },
  });
  return generators || [];
};

const getRecommendedTracks = async (accessToken, seeds) => {
  const recommendationUrl = `https://api.spotify.com/v1/recommendations`;
  const seedArtists = [];
  const seedGenres = [];
  const seedTracks = [];
  const shuffledSeeds = seeds.sort(() => Math.random() - 0.5).slice(0, 5);
  shuffledSeeds.forEach((seed) => {
    if (seed.type === `Artist`) {
      seedArtists.push(seed.id);
    } else {
      seedTracks.push(seed.id);
    }
  });
  const finalUrl = `${recommendationUrl}?seed_artists=${seedArtists.join(
    `,`
  )}&seed_tracks=${seedTracks.join(`,`)}&seed_genres=${seedGenres.join(`,`)}`;
  const rawResponse = await fetch(finalUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });
  const recommendationRes = await rawResponse.json();
  return recommendationRes.tracks;
};

const createPlaylist = async (user, name) => {
  const playlistUrl = `https://api.spotify.com/v1/users/${user.spotify_id}/playlists`;
  const playlistName = await getNextPlaylistName(user.accessToken, name);
  const rawResponse = await fetch(playlistUrl, {
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": `application/json`,
    },
    method: "POST",
    body: JSON.stringify({ name: playlistName }),
  });
  return await rawResponse.json();
};

const addTracksToPlaylist = async (accessToken, playlistId, trackUris) => {
  const addTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUris.join(
    `,`
  )}`;
  await fetch(addTracksUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });
};

const getNextPlaylistName = async (accessToken, generatorName) => {
  const playlistsUrl = `https://api.spotify.com/v1/me/playlists`;
  const rawResponse = await fetch(playlistsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });
  const playlists = await rawResponse.json();
  const generatedPlaylists = playlists.items.filter((playlist) => {
    return playlist.name.includes(generatorName);
  });
  let mostRecentPlaylist = ``;
  if (generatedPlaylists.length) {
    mostRecentPlaylist = generatedPlaylists.sort((a, b) => b - a)[0].name;
  }
  const regex = /\d+$/;
  const latestPlaylistNumber = mostRecentPlaylist.match(regex);
  const nextPlaylistNumber = latestPlaylistNumber
    ? parseInt(latestPlaylistNumber[0]) + 1
    : 1;
  return `${generatorName} ${nextPlaylistNumber}`;
};

const editGenerator = async (ctx) => {
  const generatorId = parseInt(ctx.params.id);
  const generator = await Generator.findOne({
    where: {
      id: generatorId,
    },
  });
  if (generator.owner_id !== ctx.state.user.id) {
    return (ctx.response.body = { isError: true });
  }
  const body = ctx.request.body;
  generator.name = body.generatorName;
  generator.seeds = body.generatorSeeds;
  generator.schedule_frequency = body.generatorFrequency;
  generator.schedule_day = body.generatorDay;

  try {
    await generator.save();
  } catch {
    return (ctx.response.body = { isError: true });
  }

  return (ctx.response.body = { isError: false });
};

const deleteGenerator = async (ctx) => {
  const generatorId = parseInt(ctx.params.id);
  const generator = await Generator.findOne({
    where: {
      id: generatorId,
    },
  });
  if (generator.owner_id !== ctx.state.user.id) {
    return (ctx.response.body = { isError: true });
  }
  try {
    await generator.destroy();
    mp.track(EVENTS.GENERATOR_DELETED, {
      [PROPERTIES.USER_ID]: ctx.state.user.id,
      [PROPERTIES.GENERATOR_ID]: generatorId,
      [PROPERTIES.DISTINCT_ID]: ctx.state.user.id,
    });
  } catch (err) {
    console.log(err);
    return (ctx.response.body = { isError: true });
  }
  const userGenerators = await getGeneratorsByOwnerId(ctx.state.user.id);

  return (ctx.response.body = { isError: false, generators: userGenerators });
};

module.exports = {
  handleSearch,
  createGenerator,
  generatePlaylist,
  getUserGenerators,
  buildPlaylist,
  editGenerator,
  deleteGenerator,
};
