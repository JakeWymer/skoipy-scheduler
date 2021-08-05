const Mixpanel = require("mixpanel");

const isProdEnv = process.env.NODE_ENV === `production`;
const mpProjectToken = process.env.REACT_APP_MP_PROJECT_TOKEN;

const mixpanel = Mixpanel.init(mpProjectToken, {
  debug: !isProdEnv,
});

const EVENTS = {
  GENERATOR_CREATED: `Generator Created`,
  GENERATOR_CREATION_FAILED: `Generator Creation Failed`,
  GENERATOR_DELETED: `Generator Deleted`,
  PLAYLIST_GENERATED: `Playlist Generated`,
  PLAYLIST_GENERATION_FAILED: `Playlist Generation Failed`,
  SIGN_UP: `Sign Up`,
};

const PROPERTIES = {
  USER_ID: `User ID`,
  GENERATOR_NAME: `Generator Name`,
  GENERATOR_ID: `Generator ID`,
  DISTINCT_ID: `distinct_id`,
};

module.exports = {
  mp: mixpanel,
  EVENTS,
  PROPERTIES,
};
