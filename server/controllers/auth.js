const btoa = require("btoa");
const fetch = require("node-fetch");
const uuid4 = require("uuid4");
const crypto = require("crypto");
const { User, ApikeyUser } = require("../models");
const { mp, EVENTS, PROPERTIES } = require("../tracking");

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyCallbackUrl = process.env.SPOTIFY_CALLBACK_URL;
const authRedirect = `${process.env.BASE_URL}/dashboard`;
const hashSecret = process.env.HASH_SECRET;

const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
  spotifyCallbackUrl
)}&scope=user-read-private%20user-read-email%20playlist-modify-public`;

const GrantType = {
  AUTHORIZATION_CODE: `authorization_code`,
  REFRESH_TOKEN: `refresh_token`,
};

const getUser = async (ctx) => {
  const userId = ctx.session?.userId;
  if (userId) {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    return (ctx.body = { user: user.toJson() });
  }
  return (ctx.body = null);
};

const logOut = (ctx) => {
  ctx.session = null;
  return (ctx.status = 200);
};

// Essentially our login function
const spotifyCallback = async (ctx) => {
  const authCode = ctx.request.query?.code;
  if (authCode) {
    try {
      const tokens = await fetchTokens(GrantType.AUTHORIZATION_CODE, authCode);
      const { accessToken, refreshToken } = tokens;
      if (accessToken && refreshToken) {
        const spotifyUser = await getSpotifyUser(accessToken);
        const user = await getOrCreateUser(
          spotifyUser.id,
          spotifyUser.display_name,
          spotifyUser.email,
          refreshToken
        );
        ctx.session.userId = user.id;
        ctx.session.save();
        ctx.response.redirect(authRedirect);
      } else {
        ctx.response.redirect(`/`);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    ctx.response.redirect(`/`);
  }
};

const fetchTokens = async (grantType, grantValue) => {
  const tokenUrl = `https://accounts.spotify.com/api/token`;
  const postBody = new URLSearchParams();

  postBody.append("grant_type", grantType);

  if (grantType === GrantType.AUTHORIZATION_CODE) {
    postBody.append("code", grantValue);
    postBody.append("redirect_uri", spotifyCallbackUrl);
  } else if (grantType === GrantType.REFRESH_TOKEN) {
    postBody.append("refresh_token", grantValue);
  } else {
    throw new Error(`Unsupported grant type`);
  }
  const authCredentials = btoa(`${spotifyClientId}:${spotifyClientSecret}`);

  try {
    // Need to use fetch here because axios overwrites the content type header
    const rawResponse = await fetch(tokenUrl, {
      headers: {
        Authorization: `Basic ${authCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: postBody,
    });
    const tokenRes = await rawResponse.json();
    const { access_token: accessToken, refresh_token: refreshToken } = tokenRes;
    if (grantType === GrantType.AUTHORIZATION_CODE) {
      return { accessToken, refreshToken };
    } else {
      return { accessToken };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getOrCreateUser = async (spotifyId, displayName, email, refreshToken) => {
  let user = await User.findOne({
    where: {
      spotify_id: spotifyId,
    },
  });
  if (!user) {
    // const encryptedToken = await encryptToken(refreshToken);
    user = await User.create({
      email,
      username: displayName,
      spotify_id: spotifyId,
      refresh_token: refreshToken,
    });
    mp.track(EVENTS.SIGN_UP, {
      [PROPERTIES.USER_ID]: user.id,
      [PROPERTIES.DISTINCT_ID]: user.id,
    });
  }
  return user;
};

const getSpotifyUser = async (accessToken) => {
  const url = `https://api.spotify.com/v1/me`;
  const rawResponse = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await rawResponse.json();
};

const generateApiKey = async (ctx) => {
  let existingApikeyUser = await ApikeyUser.findOne({
    where: {
      user_id: ctx.state.user.id,
    },
  });
  if(existingApikeyUser) {
    await existingApikeyUser.destroy();
  }

  const key = uuid4();
  let response = {isError: false};
  const hash = hashValue(key);

  await ApikeyUser.create({
    api_key: hash,
    user_id: ctx.state.user.id, 
  });

  response.apiKey = key; 

  return ctx.body = response;
}

const getUserByApiKey = async (apiKey) => {
  const hashedKey = hashValue(apiKey);
  let apikeyUser = await ApikeyUser.findOne({
    where: {
      api_key: hashedKey,
    },
    include: User,
  });

  return apikeyUser.User
}

const hashValue = (str) => {
  // create a sha-256 hasher
  const sha256Hasher = crypto.createHmac("sha256", hashSecret);

  // hash the string
  // and set the output format
  const hash = sha256Hasher.update(str).digest("base64");
  return hash;
}

module.exports = {
  getUser,
  logOut,
  spotifyAuthUrl,
  spotifyCallback,
  fetchTokens,
  GrantType,
  getUserByApiKey,
  generateApiKey,
};
