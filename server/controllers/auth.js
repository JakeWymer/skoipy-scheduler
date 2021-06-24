const btoa = require("btoa");
const fetch = require("node-fetch");
const UserModel = require("../db/models/User");
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyCallbackUrl = process.env.SPOTIFY_CALLBACK_URL;
const authRedirect = `${process.env.BASE_URL}/dashboard`;

const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURI(
  spotifyCallbackUrl
)}&scope=user-read-private%20user-read-email%20playlist-modify-public`;

const GrantType = {
  AUTHORIZATION_CODE: `authorization_code`,
  REFRESH_TOKEN: `refresh_token`,
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

const getOrCreateUser = async (spotifyId, email, refreshToken) => {
  const user = await UserModel.findOne({
    where: {
      spotify_id: spotifyId,
    },
  });
  if (!user) {
    // const encryptedToken = await encryptToken(refreshToken);
    return await UserModel.create({
      email,
      spotify_id: spotifyId,
      refresh_token: refreshToken,
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

module.exports = {
  spotifyAuthUrl,
  spotifyCallback,
  fetchTokens,
  GrantType,
};
